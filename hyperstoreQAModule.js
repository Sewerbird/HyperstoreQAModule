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

	//QA Module
	var QAModule = React.createClass({displayName:"QAModule",
		getInitialState: function(){
			return {data:{topic:{question:"How much wood would a woodchuck chuck?",details:randText()},answers:[]}}
		},
		render: function(){
			return (
					<div className="QAModule panel panel-default">
						<QATopic data={this.state.data.topic}/>
						<QASubmitAnswer />
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

	//Answer Submit
	var QASubmitAnswer = React.createClass({displayName:"AnswerSubmit",
		render: function(){
			return (
					<div className="AnswerSubmit">
						<h4>Do You Know?</h4>
						<textarea></textarea>
					</div>
				)

		}
	})

	//Answer List
	var QAAnswerList = React.createClass({displayName: "AnswerList",
		render: function(){
			return (
					<div className="AnswerList">
						<h4>Answers...</h4>
						<QAAnswer />
						<QAAnswer />
						<QAAnswer />
					</div>
				)
		}
	})
	//Answer
	var QAAnswer = React.createClass({displayName:"Answer",
		render: function(){
			var answerText = randText();
			return (
					<div className="Answer">
						<p>{answerText}</p>
					</div>
				)

		}
	})

	React.renderComponent(
		<QAModule />,
		document.getElementById(domTargetID)
	);	
}