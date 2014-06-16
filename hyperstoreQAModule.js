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
function HyperstoreQAModule(domTargetID, hyperstoreApplicationName){
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
	var browserUser = {name:"You, the Viewer", avatarLink: "http://forum.kerbalspaceprogram.com/images/smilies/k_cheesy.gif"};
	//QA Module
	var QAModule = React.createClass({displayName:"QAModule",
		getInitialState: function(){
			return {data:{
				topic:{question:"How much wood would a woodchuck chuck?",details:randText()},
				answers:[
					{
						member:{name:"Some Mofo #"+Math.ceil(Math.random()*100000), avatarLink: "http://forum.kerbalspaceprogram.com/images/smilies/k_cheesy.gif"},
						voteInfo:{up:Math.floor(Math.random()*30),down:Math.floor(Math.random()*20)},
						answerText:randText(),
						createdAt:new Date()
					},
					{
						member:{name:"Some Mofo #"+Math.ceil(Math.random()*100000), avatarLink: undefined},
						voteInfo:{up:Math.floor(Math.random()*30),down:Math.floor(Math.random()*20)},
						answerText:randText(),
						createdAt:new Date()
					}
				]}}
		},
		render: function(){
			return (
					<div className="QAModule panel panel-default">
						<QATopic data={this.state.data.topic}/>
						<QAAnswerSubmit />
						<QAAnswerList data={this.state.data.answers} />
					</div>
				)
		},
		handleAnswerSubmit: function(){

		}
	})

	//Topic Statement
	var QATopic = React.createClass({displayName:"QATopic",
		render: function(){
			return (
					<div className="QATopic">
						<h3>{this.props.data.question}</h3>
						<p>{this.props.data.details}</p>
					</div>
				)
		}
	})

	//QA Answer Submit
	var QAAnswerSubmit = React.createClass({displayName:"AnswerSubmit",
		render: function(){
			return (
				<div className="well" style={{"padding-left":'5px',"padding-right":'5px',"padding-bottom":'0px',"margin-bottom":'0px',"padding-top":'5px',"margin-left":'5px',"margin-right":'5px'}}>
					<div className="AnswerSubmit panel panel-default" style={{"margin":'0px',"margin-bottom":'5px'}}>
						<div className="panel-heading">
							<h4 className="panel-title">Do You Know?</h4>
						</div>
						<div className="panel-body">
							<MemberInfo data={browserUser} />
							<br />
							<textarea style={{width:'100%'}} ></textarea>
						</div>
					</div>
				</div>
				)

		}
	})

	//QA Answer List
	var QAAnswerList = React.createClass({displayName: "AnswerList",
		render: function(){
			var answers = this.props.data.map(function(answer){
				return QAAnswer({member: answer.member, voteInfo: answer.voteInfo, answerText: answer.answerText, answeredAt: answer.createdAt})
			})
			return (
					<div className="AnswerList">
						<h4>Answers...</h4>
						<hr />
						{answers}
					</div>
				)
		}
	})
	//QA Answer
	var QAAnswer = React.createClass({displayName:"Answer",
		render: function(){
			console.info(this.props);
			var answerText = this.props.answerText;
			var voteInfo = this.props.voteInfo;
			var answerDate = this.props.answeredAt;
			var member = this.props.member;
			return (
					<div className="Answer">
						<div  style={{float:'left', "margin-left":'-45px'}}>
							<VoteWidget data={voteInfo}/>
						</div>
						<div>
							<div class="row">
								<div class="col-lg-12 col-12">
									<MemberInfo data={member} />
								</div>
							</div>
							<div class="row">
								<div class="col-lg-12 col-12">
									<h6 style={{display:"inline-block"}}> - {moment(answerDate).format("ll")}</h6>
									<br />
									<p>{answerText}</p>
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
		render: function(){
			var netCount = this.props.data.up - this.props.data.down;
			return (
					<div className="VoteWidget btn-group-vertical">
						<button className="btn btn-sm btn-default">+</button>
						<button className="btn btn-sm btn-default" value="disabled" disabled>{netCount}</button>
						<button className="btn btn-sm btn-default">-</button>
					</div>
				)
		}
	})
	//Member Info
	var MemberInfo = React.createClass({displayName:"MemberInfo",
		render: function(){
			console.warn(this.props);
			var memberName = this.props.data.name;
			var memberAvatar = this.props.data.avatarLink?this.props.data.avatarLink:"";
			return (
					<div style={{display:"inline-block", 'padding-left':"5px"}} className="MemberInfo">
						<img src={memberAvatar} />
						<h5 style={{display:"inline-block", 'padding-left':"5px"}}>{memberName}</h5>
					</div>
				)
		}
	})

	React.renderComponent(
		<QAModule />,
		document.getElementById(domTargetID)
	);	
}