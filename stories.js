"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  addAllStories();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteButton = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  //if logged in, show favorite or non favorite star symbol
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        <div>
        ${showDeleteButton ? getDeleteButton() : "" }
        ${showStar ? getStar(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
        </div>
      </li>
    `);
}

//This function will make a delete button in HTML for story
function getDeleteButton(){
  return `<span class="trash-can">
            <i class="fas fa-trash-alt"></i></span>`;
}

//This function will make a favorite/non favorite star 
function getStar(story, user){
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `<span class="star">
            <i class="${starType} fa-star"></i></span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function addAllStories() {
  console.debug("addAllStories");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//This function handles deleting a story

async function deleteStory(evt) {
  console.debug("deleteStory");

  const $targetClosestLi = $(evt.target).closest("li");
  const storyId = $targetClosestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  //refresh user story list
  await addMyStories();
}

$myStories.on("click", ".trash-can", deleteStory);

//This function handles new story form

async function newStoryForm(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  //collects form information
  const title = $("#createTitle").val();
  const url = $("#createUrl").val();
  const author = $("#createAuthor").val();
  const username = currentUser.username
  const storyData = { title, url, author, username};

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story); 

  //This will hide and reset the form
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

$submitForm.on("submit", newStoryForm);

function addMyStories() {
  console.debug("addMyStories");

  $myStories.empty();

  if(currentUser.myStories.length === 0){
    $myStories.append("<h5> No Stories were added by user yet!!!</h5>");
  }else{
    //This forloop will loop through all users stories and generate HTML
    for (let story of currentUser.myStories){
      let $story = generateStoryMarkup(story, true);
      $myStories.append($story);
    }
  }

  $myStories.show();
}

//This function puts favorites list on page

function addFavoritesList(){
  console.debug("addFavoritesList");

  $favoritedStories.empty();

  if(currentUser.favorites.length === 0){
    $favoritedStories.append("<h5> No Favorites added!!!</h5>");
  }else{
    //This for loop will loop thorugh all users favorites and generate HTML
    for(let story of currentUser.favorites){
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}

//This funciton handles favorited and un-favorited stories

async function toggleFavorite(evt){
  console.debug("toggleFavorite");

  const $target = $(evt.target);
  const $targetClosestLi = $target.closest("li");
  const storyId = $targetClosestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  //This will check if item is favorited
  if($target.hasClass("fas")){
    //removes users fav list and change star when it is currently a favorite
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }else{
    //addes users story to fav list and changing star when currently not a favorite
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleFavorite);
