(function() {
	'use strict';
	angular.module('sentihelm')

	
			.controller('DashboardController', [ 'languageService', 
				function(languageService){
					var self =this;
					self.unreadTips = 0;
					self.unwatch = 0;
					self.unreadChats = 0;
					self.responseTime = 0;
					self.lang = languageService;
					
					self.tips= [
					{type: 'Assult', time: '4 miuntes ago'},
					{type: 'Robbery',time: '25 miuntes ago'},
					{type: 'Assult',time: '4 miuntes ago'},
					{type: 'Assult',time: '11:32 AM'}
					];
					self.stream = [
					{type: 'video',time: '10 miuntes ago'},
					{type: 'video',time: '15 miuntes ago'},
					{type: 'video',time: '20 miuntes ago'},
					{type: 'video',time: '33 miuntes ago'}
					];
					self.chat = [
					{type: 'Assult', time: '4 miuntes ago'},
					{type: 'Robbery',time: '25 miuntes ago'},
					{type: 'Assult',time: '4 miuntes ago'},
					{type: 'Assult',time: '11:32 AM'}

					]

					self.fetchTotalTips = function(){
						self.unreadTips = 1;
					}
					self.fetchTotalStreams = function(){
						self.unwatch =1;
					}
					self.fetchTotalChats = function(){
						self.unreadChats =2;
					}
					self.fetchResponceTime = function(){
						self.responseTime =10;
					}

					self.fetchTotalTips();
					self.fetchTotalChats();
					self.fetchTotalStreams();
					self.fetchResponceTime();


				}]);


})();