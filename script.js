const API_USERS = 'https://gorest.co.in/public/v2/users?per_page=40&page=1';
const API_POSTS = 'https://gorest.co.in/public/v2/posts';
const API_COMMENTS = 'https://gorest.co.in/public/v2/comments';

const usersListContainer = document.querySelector('.users-list-container');
const postsListContainer = document.querySelector('.posts-list-container');
const postSelect = document.querySelector('.post-select');

let postBodyText, postNameText, selectedUserId, selectedPostId;

function createUserList(data) {
  const ul = document.createElement('ul');
  ul.classList.add('user-list');
  data.map((user) => {
    const li = document.createElement('li');
    li.textContent = user.name;
    li.id = user.id;
    ul.appendChild(li);
  });
  usersListContainer.appendChild(ul);
}

function createPostsList(data) {
  postsListContainer.innerHTML = '';
  postSelect.textContent = 'User Posts';
  const postsList = document.createElement('ul');
  postsList.classList.add('posts-list');
  data.map((post) => {
    const li = document.createElement('li');
    li.classList.add(`list-el`);

    const postTitle = document.createElement('h3');
    postTitle.textContent = post.title;
    postTitle.id = post.id;
    postTitle.classList.add('post-title');
    li.appendChild(postTitle);

    const postComments = document.createElement('span');
    postComments.id = post.id;
    postComments.classList.add('post-comments');
    postComments.textContent = 'Comments';
    postTitle.appendChild(postComments);

    const postBody = document.createElement('p');
    postBody.id = `body-${post.id}`;
    postBody.classList.add('post-body');
    postBody.textContent = post.body;
    li.appendChild(postBody);

    postsList.appendChild(li);
  });
  postsListContainer.appendChild(postsList);
}

function createPostCommentsList(data, postId, userC, userCB) {
  if (data.length > 0) {
    postSelect.textContent = `Post Comments`;
    postsListContainer.innerHTML = '';
    const commentsContainer = document.createElement('ul');
    commentsContainer.classList.add('comments-list');

    const postsDetails = document.createElement('li');
    postsDetails.classList.add(`post-details`);
    commentsContainer.appendChild(postsDetails);

    const postTitle = document.createElement('h3');
    postTitle.classList.add('post-title');
    postTitle.textContent = userC;
    postsDetails.appendChild(postTitle);

    const postsReturn = document.createElement('button');
    postsReturn.classList.add('posts-return');
    postsReturn.textContent = 'Return to Posts';
    postTitle.appendChild(postsReturn);

    const postBody = document.createElement('p');
    postBody.textContent = userCB;
    postsDetails.appendChild(postBody);

    const postComments = document.createElement('h2');
    postComments.textContent = 'Comments';
    commentsContainer.appendChild(postComments);

    const commentsList = document.createElement('li');
    commentsList.classList.add(`comments-list`);
    commentsContainer.appendChild(commentsList);

    data.map((id) => {
      const commentAuthorName = document.createElement('h5');
      commentAuthorName.textContent = `${id.name}`;
      commentsList.appendChild(commentAuthorName);

      const commentBody = document.createElement('p');
      commentBody.textContent = `${id.body}`;
      commentsList.appendChild(commentBody);
    });
    postsListContainer.appendChild(commentsContainer);
  }
}

async function getData() {
  const response = await fetch(API_USERS);
  const data = await response.json();
  createUserList(data);
}

getData();

async function getUserPosts() {
  const response = await fetch(`${API_POSTS}?user_id=${selectedUserId}`);
  const data = await response.json();
  createPostsList(data);
}

async function getPostComments() {
  const response = await fetch(`${API_COMMENTS}?post_id=${selectedPostId}`);
  const data = await response.json();
  console.log(data);
  createPostCommentsList(data, selectedPostId, postNameText, postBodyText);
}

function selectUser(e) {
  if (e.target.closest('li')) {
    // Тут я намагався уникнути бага. При виділенні декількох елементів клас додавався до всіх дочірніх елементів.
    // Пофіксив але не впевниний що продуктивність методу ок.\
    const childElements = usersListContainer.querySelectorAll('li');
    childElements.forEach((element) => {
      element.classList.remove('selected-user');
    });
    e.target.classList.add('selected-user');
    selectedUserId = e.target.id;
    getUserPosts();
  }
}

usersListContainer.addEventListener('click', selectUser);

function selectPostComments(e) {
  postNameText = undefined;
  postBodyText = undefined;
  const id = e.target.id;
  console.log(e.target);
  if (id > 0) {
    selectedPostId = id;
    const postTitle = document.getElementById(`${selectedPostId}`);
    postNameText = postTitle.childNodes[0].nodeValue.trim();
    console.log(postNameText);

    const postBodyContent = document.getElementById(`body-${selectedPostId}`);
    postBodyText = postBodyContent.textContent;

    getPostComments();
  }
  if (e.target.classList.contains('posts-return')) {
    getUserPosts();
  }
}

postsListContainer.addEventListener('click', selectPostComments);
