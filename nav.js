"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  addAllStories(); 
}

$body.on("click", "#nav-all", navAllStories);

//This function shows the story submitted form on click "submit"

function navSubmitStoryClick(evt){
  console.debug("navSubmitStoryClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$navSubmitStory.on("click", navSubmitStoryClick);

// This function shows favorite stories on click "favorites"

function navFavoritesClick(evt){
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  addFavoritesList(); 
}

$body.on("click", "#favorites", navFavoritesClick);

// This function shows "My Stories" on click

function navMyStories(evt){
  console.debug("navMyStories", evt);
  hidePageComponents();
  addMyStories(); 
  $myStories.show();
}

$body.on("click", "#navStories", navMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $storiesContainer.hide();
}

$navLogin.on("click", navLoginClick);

//This function hides every but the profile when clicking "Profile"

function navProfileClick(evt){
  console.debug("navProfileClick", evt);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", navProfileClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").css('display', 'flex');
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
