/**
* @jsx React.DOM
*/
function HyperstoreStandaloneQAAskButton(domTargetID, topicURL, options){
	var module = this;
	console.log(domTargetID + " to ",options);
	module.topicStore = options && options.useStore?options.useStore:new Backwire.Hyperstore(topicURL);
	module.submitCallback = !options || options.submitCallback === undefined?function(){}:options.submitCallback;
	//QA Ask Button
	var QAAskButton = React.createClass({displayName: "AskButton",
		handleClick : function(){
			this.refs.askTopic.show();
		},
		render: function(){
			return (
				<div>
					<button className="AskButton btn btn-default btn-success pull-right" style={{display:"inline-block"}} onClick={this.handleClick}>
						Ask A Question!
					</button>
					<QAAskSubmit ref="askTopic" />
				</div>
				)
		}
	})
	var QAAskSubmit = React.createClass({displayName:"AskSubmit",
		getInitialState: function() {
			var self = this;
			module.topicStore.getUser(function(res,err,ver){
				self.forceUpdate();
			})
			return {
				className: 'modal fade'
			};
		},
		show: function() {
			this.setState({ className: 'modal fade show' });
			setTimeout(function() {
				this.setState({ className: 'modal fade show in' });
			}.bind(this), 0);
		},
		hide: function() {
			// Fade out the help dialog, and totally hide it after a set timeout
			// (once the fade completes)
			this.setState({ className: 'modal fade show' });
			setTimeout(function() {
				this.setState({ className: 'modal fade' });
			}.bind(this), 400);
		},
		ask: function(event){
			event.preventDefault();
			var self = this;
			if(module.topicStore.user)
			{
				var question = {
					answers: [],
					createdAt: new Date(),
					question: this.refs.askQuestion.getDOMNode().value,
					details: this.refs.askDetails.getDOMNode().value,
					asker: {
						_id: module.topicStore.user._id,
						username: module.topicStore.user.username,
						avatarLink: module.topicStore.user.profile?module.topicStore.user.profile.avatarLink:undefined
					}
				}
				module.topicStore.insert(question,function(res,err,ver){
					if(err)
						throw err
					else if(res)
					{
						console.info(res);
						console.info(module.submitCallback);
						self.hide();
						self.refs.askQuestion.getDOMNode().value = "";
						self.refs.askDetails.getDOMNode().value = "";
						module.submitCallback(res[0]._id);
					}
				})
			}
		},
		render: function() {
		  return (
		    <div className={this.state.className} ref='askTopic'>
		      <div className="modal-dialog">
		        <form id="askForm" className="modal-content" onSubmit={this.ask}>
		          <div className="modal-header">
		            <h4 className="modal-title">Ask Your Question!</h4>
		          </div>
		          <div className="modal-body">
		          	<input ref="askQuestion" type="text" form="askForm" style={{'max-width':'100% !important', width:'100% !important'}} />
		            <textarea ref="askDetails" form="askForm" style={{'max-width':'100% !important', width:'100% !important'}} />
		          </div>
		          <div className="modal-footer">
		            <button type="button" className="btn btn-default btn-warning" onClick={this.hide}>Close</button>
		            <input type="submit" className="btn btn-default btn-success" />
		          </div>
		        </form>
		      </div>
		    </div>
		  );
		}
	});	
	React.renderComponent(
		<QAAskButton />,
		document.getElementById(domTargetID)
	);	
}
//Hyperstore Q&A Module
function HyperstoreQAModule(domTargetID, content_id, topicURL, answerURL, commentURL, options, voteCallback, askCallback){
	var module = this;
	this.topicStore = new Backwire.Hyperstore(topicURL,{silent:true});
	this.answerStore = new Backwire.Hyperstore(answerURL,{silent:true});
	this.defaultAvatar = options.defaultUserAvatar?options.defaultUserAvatar:"http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm";
	this.commentModule = undefined;
	this.options = options?options:{};
	this.voteCallback = voteCallback;
	this.askCallback = function(newID){module.changeContentID(newID)};
	console.warn("fooooo",this.askCallback);

	this.changeContentID = function(newID){
		this.refs.myModule.changeTarget(newID);
	}
	//Detect HyperstoreCommentModule and use it if no commentModule provided
	if(!options.commentModule && typeof HyperstoreCommentModule !== 'undefined')
	{
		this.commentModule = HyperstoreCommentModule;
	}
	//Use specified comment module.
	else if(options.commentModule)
	{
		this.commentModule = options.commentModule;
	}

	//QA Module
	var QAModule = React.createClass({displayName:"QAModule",
		changeTarget: function(newID){
			console.warn("made it");
			var self = this;
			content_id = newID;
			module.answerStore.resetReactivity();
			module.topicStore.resetReactivity();
			module.answerStore.find({topic_id:content_id},function(res,err,ver){
				if(res && !err)
				{
					self.setState(_.extend({},this.state,{answers:res}));
					$('.expandComment').readmore();
				}
				else if(err) console.error(err);
				else console.warn("Answers for content_id "+content_id+" not found.");
			})
			module.topicStore.findOne({_id:content_id},function(res,err,ver){
				if(res && !err)
				{
					self.setState(_.extend({},this.state,{topic:res}));
				}
				else if(err) console.error(err);
				else console.warn("Content for content_id "+content_id+" not found.");
			})
			React.unmountComponentAtNode(document.getElementById('topicView'));
		},
		getInitialState: function(){
			var self = this;
			module.topicStore.getUser(function(res,err,ver){
				self.forceUpdate();
			})
			module.answerStore.find({topic_id:content_id},function(res,err,ver){
				if(res && !err)
				{
					self.setState(_.extend({},this.state,{answers:res}));
					$('.expandComment').readmore();
				}
				else if(err) console.error(err);
				else console.warn("Answers for content_id "+content_id+" not found.");
			})
			module.topicStore.findOne({_id:content_id},function(res,err,ver){
				if(res && !err)
				{
					self.setState(_.extend({},this.state,{topic:res}));
				}
				else if(err) console.error(err);
				else console.warn("Content for content_id "+content_id+" not found.");
			})
			return {data:{}};
		},
		handleVote : function(sign, answer){
			if(module.voteCallback) module.voteCallback(content_id,answer,sign,module.topicStore.user);
			/*
			var action = sign>0?{'voteInfo.up':1}:{'voteInfo.down':1};
			module.answerStore.update({_id:answer},{$inc:action}, function(res,err,ver){
				if(!err)
				{
					console.log("Successfully voted");
				} else console.error("Error voting: ", err);
			})
			*/
		},
		handleAnswerSubmit : function(answer){
			module.answerStore.insert(answer,function(res,err,ver){
				if(res && !err)
				{
					console.log("Successfully posted ",res[0])
					module.topicStore.update({_id:content_id},{$push:{answers: res[0]._id}})
				} else console.error("Error posting answer: ", err);
			})
		},
		render: function(){
			//Bad topic retrieval
			if(_.size(_.keys(this.state.topic)) == 0) 
				return (<div classname="QAModule panel panel-default" style={{"padding":"5px", width:"100%"}}><p>"Bad topic retrieval"</p></div>);
			//No Answers yet!
			if(_.size(this.state.answers) == 0) 
				return (
					<div className="QAModule panel panel-default" style={{"padding":"5px"}}>
						<QATopic data={this.state.topic} changeCallback={this.changeTarget} />
						<QAAnswerSubmit onAnswerSubmit={this.handleAnswerSubmit} headerText={"No Answers Submitted: Be the First!"}/>
					</div>
				)
			//Standard view
			return (
					<div className="QAModule panel panel-default" style={{"padding":"5px"}}>
						<QATopic data={this.state.topic} />
						<QAAnswerSubmit onAnswerSubmit={this.handleAnswerSubmit} headerText={"What do you think?"}/>
						<QAAnswerList data={this.state.answers} voteMethod={this.handleVote} />
					</div>
				)
		}
	})

	//Topic Statement
	var QATopic = React.createClass({displayName:"QATopic",
		componentDidUpdate: function(){
			var self = this;
			module.askButton = new HyperstoreStandaloneQAAskButton("askButton",null,{useStore:module.topicStore, submitCallback:this.props.changeCallback});
			if(module.commentModule)
			{
				self.commentTarget = "topicStatementComments";
				self.commentsURL = commentURL;
				self.contentID = content_id;
				if(module.options)
					self.options = module.options.commentModuleOptions;
				self.commentBox = new module.commentModule(self.commentTarget, self.commentsURL, self.contentID,self.options);
			}
			return {data:[]};
		},
		render: function(){
			return (
					<div className="QATopic" id="topicView">
						<h3>{this.props.data.question}</h3>
						<span id="askButton" />
						<MemberInfo data={this.props.data.asker} />
						<h6 style={{'padding-left':'5px', display:"inline-block"}}> - {moment(this.props.createdAt).format("ll")}</h6>
						<p>{this.props.data.details}</p>
						<div id="topicStatementComments" />
					</div>
				)
		}
	})
	//QA Answer Submit
	var QAAnswerSubmit = React.createClass({displayName:"AnswerSubmit",
		handleSubmit : function(event){
			event.preventDefault();
			if(module.topicStore.user)
			{
				var answer = {
					topic_id:content_id,
					answerText: this.refs.answerText.getDOMNode().value,
					member: {
						_id: module.topicStore.user._id,
						username: module.topicStore.user.username,
						avatarLink: module.topicStore.user.profile?module.topicStore.user.profile.avatarLink:undefined
					},
					createdAt: new Date(),
				};
				//TODO: Do a real look at how voting should be handled properly... this is ripe for abuse/multi-voting
				console.info("submitting",answer);
				this.props.onAnswerSubmit(answer);
			}else return false;
		},
		render: function(){
			return (
				<div className="well" style={{"padding-left":'5px',"padding-right":'5px',"padding-bottom":'0px',"margin-bottom":'0px',"padding-top":'5px',"margin-left":'5px',"margin-right":'5px'}}>
					<form onSubmit={this.handleSubmit} id="answerForm" className="AnswerSubmit panel panel-default" style={{"margin":'0px',"margin-bottom":'5px'}}>
						<div className="panel-heading">
							<h4 className="panel-title">{this.props.headerText}</h4>
						</div>
						<div className="panel-body">
							<MemberInfo data={module.topicStore.user} />
							<div style={{display:"inline-block", float:"right"}}>
								<input type="submit" value="Answer" />
							</div>
							<br />
							<textarea name="answerText" ref="answerText" form="answerForm" style={{'max-width':'100% !important', width:'100% !important'}} ></textarea>
						</div>
					</form>
				</div>
				)

		}
	})

	//QA Answer List
	var QAAnswerList = React.createClass({displayName: "AnswerList",
		render: function(){
			var vm = this.props.voteMethod;
			var answers = this.props.data.map(function(answer){
				return QAAnswer({data:answer, voteMethod:vm})
			})
			return (
					<div className="AnswerList">
						<h3 className="page-header">Answers...</h3>
						{answers}
					</div>
				)
		}
	})
	//QA Answer
	var QAAnswer = React.createClass({displayName:"Answer",		
		componentDidMount: function(){
			var self = this;
			if(module.commentModule)
			{
				self.commentTarget = this.props.data._id+"_commentBox";
				self.commentsURL = commentURL;
				self.contentID = this.props.data._id;
				if(module.options)
					self.options = module.options.commentModuleOptions;
				self.commentBox = new module.commentModule(self.commentTarget, self.commentsURL, self.contentID,self.options);
			}
			return {data:[]};
		},
		render: function(){
			var answerID = this.props.data._id;
			var answerText = this.props.data.answerText;
			var voteInfo = this.props.data.voteInfo?_.extend(this.props.data.voteInfo,{answerID:this.props.data._id}):{up:0,down:0};
			var voteMethod = this.props.voteMethod;
			var answerDate = this.props.createdAt;
			var member = this.props.data.member?this.props.data.member:{username:"Anonymous"};
			return (
					<div className="Answer">
						<div  style={{float:'left', "margin-left":'-45px'}}>
							<VoteWidget data={voteInfo} onVote={voteMethod}/>
						</div>
						<div>
							<div class="row">
								<div class="col-lg-12 col-12">
									<MemberInfo data={member} />
									<h6 style={{'padding-left':'5px', display:"inline-block"}}> - {moment(answerDate).format("ll")}</h6>
								</div>
							</div>
							<div class="row">
								<div class="col-lg-12 col-12">
									<p className="expandComment" style={{'margin-left':'5px'}}>{answerText}</p>
								</div>
							</div>
							<div class="row" id={this.props.data._id+"_commentBoxRow"}>
								<div class="col-lg-12 col-12">
									<div id={this.props.data._id+"_commentBox"} />
								</div>
							</div>
						</div>
						<hr></hr>
					</div>
				)

		}
	})
	//Upvote Widget
	var VoteWidget = React.createClass({displayName:"VoteWidget",
		onVoteUp: function(){
			var answerID = this.props.data.answerID;
			this.props.onVote(1,answerID);
		},
		onVoteDown: function(){
			var answerID = this.props.data.answerID;
			this.props.onVote(-1,answerID);
		},
		render: function(){
			var netCount = this.props.data.up - this.props.data.down;
			return (
					<div className="VoteWidget btn-group-vertical">
						<button className="btn btn-sm btn-default" onClick={this.onVoteUp}>+</button>
						<button className="btn btn-sm btn-default" value="disabled" disabled>{netCount}</button>
						<button className="btn btn-sm btn-default" onClick={this.onVoteDown}>-</button>
					</div>
				)
		}
	})
	//Member Info
	var MemberInfo = React.createClass({displayName:"MemberInfo",
		render: function(){
			var memberName = this.props.data.username?this.props.data.username:"Anonymous";
			var memberAvatar = this.props.data.avatarLink?this.props.data.avatarLink:module.defaultAvatar;
			return (
					<div style={{display:"inline-block", 'padding-left':"5px"}} className="MemberInfo">
						<img src={memberAvatar} className="img-circle" style={{'max-width':"50px"}}/>
						<h5 style={{display:"inline-block", 'padding-left':"5px"}}>{memberName}</h5>
					</div>
				)
		}
	})
	//Utility function for uniquely id-ing answers. Might be better done server-end, breaking answers into second table?
	var generateUID = function()
	{
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);return v.toString(16);});
	}
	React.renderComponent(
		<QAModule />,
		document.getElementById(domTargetID)
	);	
}