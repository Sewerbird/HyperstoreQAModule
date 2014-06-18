/**
* @jsx React.DOM
*/
//Hyperstore Q&A Module

var arbitext = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ultrices nulla orci, sed interdum sem molestie vitae. Nullam massa libero, hendrerit malesuada elit eget, pellentesque gravida dui. Sed non ornare odio, eget eleifend tellus. Curabitur rutrum lorem ac convallis lobortis. Maecenas feugiat augue ornare, blandit leo eu, commodo lectus. Mauris vel lectus sit amet orci fermentum tincidunt. Proin interdum fringilla vestibulum. Integer sodales ornare ultricies. Fusce eros mauris, semper a dolor eget, bibendum auctor magna. Nulla rhoncus nisl vitae laoreet luctus. Morbi dolor erat, imperdiet in massa non, sagittis imperdiet leo. Nulla id tristique risus, in tristique sapien. Etiam adipiscing rhoncus tellus, vitae pulvinar eros imperdiet nec. Sed et pretium mi. Praesent a congue ante. Sed nec leo vel lorem pulvinar fringilla non in mi. Duis quis placerat sem, sed aliquam erat. Vivamus condimentum metus at dolor pellentesque tristique. Sed id quam sem. Integer lacinia feugiat lacus, eleifend ultrices erat tincidunt sit amet. Nam non velit eu tortor tincidunt sodales in a odio. Nullam eu sapien sed urna rhoncus suscipit in eget justo. Aliquam eu dolor laoreet metus faucibus accumsan vitae ut ligula. Fusce non est aliquam, sollicitudin mauris nec, sagittis risus. Phasellus purus leo, laoreet eu sapien fermentum, rhoncus ultricies tellus. Vestibulum blandit neque a mauris sagittis, vel tempus quam porttitor. Nunc quis nulla consectetur, tristique nunc in, luctus nibh. Morbi neque mauris, mattis at felis sed, placerat dignissim turpis. Aliquam nec accumsan erat. Duis vehicula pellentesque quam nec consectetur. In sollicitudin nulla at pharetra dictum. Curabitur bibendum, nisi vel gravida commodo, quam velit ornare ante, non volutpat lacus justo et dui. Curabitur ultricies libero nulla, sit amet euismod massa dictum sed. Quisque mattis felis tellus, in lacinia mauris tempus sit amet. Nulla pretium ut lorem ac cursus.";
var randText = function(){
			var begin = Math.floor(Math.random() * arbitext.length / 2);
			var end = Math.floor(Math.random() * arbitext.length / 2 + (arbitext.length / 2));
			return arbitext.substring(begin, end)
		}
function HyperstoreQAModule(domTargetID, topicURL, answerURL, content_id, options){
	/*
		QA Module
			Topic Statement
				Contributor Info (Asker's)
					User Name
				Topic Question
					editable h3
				Topic Details
					Text area with markdown
				Comments

				Comment Submit
				Topic Status
			Answer Submit
				Contributor Info (User's)
				Submission Field
			Answer
				Contributor Info (Answeror's)
				Up/downvote Widget
				Answer Text
				Comments
				Comment Submit
	*/
	var module = this;
	this.topicStore = new Backwire.Hyperstore(topicURL);
	this.answerStore = new Backwire.Hyperstore(answerURL);
	//QA Module
	var QAModule = React.createClass({displayName:"QAModule",
		getInitialState: function(){
			var self = this;
			/*
			return {
				data:{
					topic:{question:"How much wood would a woodchuck chuck?",details:randText()},
					answers:[
						{
							_id:"123456789012345678901234",
							member:{username:"Some Mofo #"+Math.ceil(Math.random()*100000), avatarLink: "http://forum.kerbalspaceprogram.com/images/smilies/k_cheesy.gif"},
							voteInfo:{up:Math.floor(Math.random()*30),down:Math.floor(Math.random()*20)},
							answerText:randText(),
							createdAt:new Date()
						},
						{
							_id:"012345678901234567890123",
							member:{username:"Some Mofo #"+Math.ceil(Math.random()*100000), avatarLink: undefined},
							voteInfo:{up:Math.floor(Math.random()*30),down:Math.floor(Math.random()*20)},
							answerText:randText(),
							createdAt:new Date()
						}
					]}}*/
			module.topicStore.getUser(function(res,err,ver){
				self.forceUpdate();
			})
			module.answerStore.find({topic_id:content_id},function(res,err,ver){
				if(res && !err)
				{
					console.info("Got Answer Store Results: ",res);
					self.setState(_.extend({},this.state,{answers:res}));
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
			var action = sign>0?{'voteInfo.up':1}:{'voteInfo.down':1};
			module.answerStore.update({_id:answer},{$inc:action}, function(res,err,ver){
				if(!err)
				{
					console.log("Successfully voted");
				} else console.error("Error voting: ", err);
			})
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
			console.info("state render",this.state);
			//Bad topic retrieval
			if(_.size(_.keys(this.state.topic)) == 0) return (<div classname="QAModule panel panel-default" style={{"padding":"5px"}}><p>"Bad topic retrieval"</p></div>);
			//No Answers yet!
			if(_.size(this.state.answers) == 0) return (
					<div className="QAModule panel panel-default" style={{"padding":"5px"}}>
						<QATopic data={this.state.topic} />
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
		render: function(){
			return (
					<div className="QATopic">
						<h3>{this.props.data.question}</h3>
						<MemberInfo data={this.props.data.asker} />
						<h6 style={{'padding-left':'5px', display:"inline-block"}}> - {moment(this.props.createdAt).format("ll")}</h6>
						<p>{this.props.data.details}</p>
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
						avatarLink: module.topicStore.user.avatarLink
					},
					createdAt: new Date(),
					voteInfo:{
						up:0,
						down:0
					}
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
		render: function(){
			console.info(this.props);
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
									<p style={{'margin-left':'5px'}}>{answerText}</p>
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
			var memberAvatar = this.props.data.avatarLink?this.props.data.avatarLink:"";
			return (
					<div style={{display:"inline-block", 'padding-left':"5px"}} className="MemberInfo">
						<img src={memberAvatar} />
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