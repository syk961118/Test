app.controller("myNoteCtrl",function($scope){
	
	$scope.message = "";
	
	$scope.left = function(){
		var length = $scope.message.length
		
		if(length>100){
			alert("超出一百位了");
		}
		return 100 - length;
	};
	
	$scope.clear = function(){
		$scope.message = "";
	};
	
	$scope.save = function(){
		alert("Note Saved");
	};
	
});
