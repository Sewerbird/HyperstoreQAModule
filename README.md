HyperstoreQAModule
==================

HyperstoreQAModule is a Backwi.re powered Quora/StackOverflow-like website module. Users can comment, upvote, and answer topics on your site. 


###Installation###

HyperstoreQAModule relies on a few different scripts. Put the following block in your html document


    <script src="http://underscorejs.org/underscore-min.js"></script>
    <script src="http://backwi.re/cdn/hyperstore.latest.js"></script>
    <script src="http://fb.me/react-0.10.0.js"></script>
    <script src="http://fb.me/JSXTransformer-0.10.0.js"></script>
    <script src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script src="http://momentjs.com/downloads/moment-with-langs.min.js"></script>
    <script src="readmore.min.js"></script>
    <script src="bootstrap.min.js"></script>
    <script type="text/jsx" src="commentBoxModule.js"></script>
	<script type="text/jsx" src="hyperstoreQAModule.js"></script>

Then, you can create a HyperstoreQA in a target html element with code like the following:

	<script type="text/jsx">
		var qaModule = new HyperstoreQAModule("content","53a140478d7dc0505a000000","http://reasonable.999geeks.pl/qANDaTopics","http://reasonable.999geeks.pl/qANDaAnswers", "http://reasonable.999geeks.pl/comments",{commentModuleOptions:{hideCommentsHeader:true, hideCommentsWhenEmptyAndSignedOut: true}},function(a,b,c,d){console.log(a,b,c,d)});
	</script>

###Usage###

HyperstoreQAModule takes several parameters:

####HyperstoreQAModule(domTargetID, content_id, topicURL, answerURL, commentURL, options, voteCallback)####

* __domTargetID__: This is the `id` of the html element that you want the Q&A module to appear, with its topic, answers, and comments.
* __content_id__: This is the `id` of the topic to displayed. This id should be the same as the `_id` field in the database.
* __topicURL__: This is the Backwi.re url to the collection that holds your topics. Typically something like "http://myApp.backwi.re/topics"
* __answerURL__: This is the Backwi.re url to the collection that holds your topics' answers. Typically something like "http://myApp.backwi.re/answers"
* __commentURL__: This is the Backwi.re url to the collection that holds the comments for answers and topics. Typically something like "http://myApp.backwi.re/comments"
* __options__: This holds various parameters that are passed to HyperstoreQAModule.
	* __commentModule__: This is the function that should be used to create comment box elements. The default (`HyperstoreCommentModule`) assumes you have HyperstoreCommentModule installed.
	* __commentModuleOptions__: This field is passed to the specified commentModule, with the intention of specifying parameters of commentboxes.
* __voteCallback__: Because the authentication of upvotes should be left to the server, this field is to be passed a function to perform when someone tries to up/downvote an answer. This callback is given the following parameters in order:
	* __topicID__: the `id` of the topic. Is the same as the `content_id` you specified.
	* __answerID__: the `id` of the answer voted. Is the same as the `_id` field of the answer in the answer collection.
	* __sign__: An integer that signals an upvote if positive, or a downvote if negative.
	* __user__: The user object of the person doing the voting, or 'false' if not logged in. Contains information visible to the client via a 'getUser()' hyperstore call.

####Implementing voteCallback####

However your server verifies up/downvotes, it needs to successfully create/update the `voteInfo` field of the specified answer in your answers collection. HyperstoreQAModule reads the `voteInfo.up` and `voteInfo.down` fields to calculate the net upvotedness of an answer.