﻿var app = angular.module('moviesApp', []);

app.factory('moviesCRUD', function ($http, $q) {
	var baseurl = "/";
	function getAllMovies() {
		var deferred = $q.defer();
		
		$http.get(baseurl + 'api/movies').then(function (result) {
			deferred.resolve(result.data);
		}, function (error) {
			deferred.reject(error);
		});
		
		return deferred.promise;
	}
	
	function addMovie(newMovie) {
		var deferred = $q.defer();
		
		$http.post(baseurl + 'api/movies', newMovie).then(function (result) {
			deferred.resolve(result.data.movie);
		}, function (error) {
			deferred.reject(error);
		});
		
		return deferred.promise;
	}
	
	function modifyMovie(updatedMovie) {
		var deferred = $q.defer();
		
		$http.put(baseurl + 'api/movies/' + updatedMovie._id, updatedMovie).then(function (data) {
			deferred.resolve(data);
		}, function (error) {
			deferred.reject(error);
		});
		
		return deferred.promise;
	}
	
	return {
		getAllMovies: getAllMovies,
		addMovie: addMovie,
		modifyMovie: modifyMovie
	};
});

app.controller('MoviesCtrl', function ($scope, moviesCRUD) {
	$scope.released = { released: true };
	$scope.notReleased = { released: false };
	
	function init() {
		moviesCRUD.getAllMovies().then(function (movies) {
			$scope.movies = movies;
		}, function (error) {
			console.log(error);
		});
	}
	
	$scope.movieReleased = function (movie) {
		
		moviesCRUD.modifyMovie({ _id: movie._id, name: movie.name, released: true, watched: movie.watched })
                  .then(function (result) {
			if (result.status === 200) {
				movie.released = true;
			}
		}, function (error) {
			console.log(error);
		});
	};
	
	$scope.movieWatched = function (movie) {
		moviesCRUD.modifyMovie(movie)
                  .then(function (result) {
			if (result.status === 200) {
				console.log("Movie updated");
			}
		}, function (error) {
			movie.watched = !movie.watched;
		});
	};
	
	$scope.addMovie = function () {
		moviesCRUD.addMovie({ name: $scope.newMovieText }).then(function (newMovie) {
			$scope.movies.push(newMovie);
			$scope.newMovieText = "";
		}, function (error) {
			console.log(error);
		});
	};
	
	init();
});
