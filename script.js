const API_USERS = 'https://gorest.co.in/public/v2/users?per_page=40&page=1';
const API_POSTS = 'https://gorest.co.in/public/v2/posts';
const API_COMMENTS = 'https://gorest.co.in/public/v2/comments';

const usersListContainer = document.querySelector('.users-list-container');
const postsListContainer = document.querySelector('.posts-list-container');
const postSelect = document.querySelector('.post-select');

let selectedUserId = undefined;
let selectedPostId = undefined;

function createUserList(data) {
  const ul = document.createElement('ul');
  ul.classList.add('user-list');
  data.map((user) => {
    const li = document.createElement('li');
    li.textContent = user.name;
    li.classList.add(`${user.id}`);
    ul.appendChild(li);
  });
  return ul;
}

function createPostsList(data) {
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
    postBody.textContent = post.body;
    li.appendChild(postBody);

    postsList.appendChild(li);
  });
  return postsList;
}

function createPostCommentsList(data, postId) {
  const ul = document.createElement('ul');
  ul.classList.add('comments-list');
  const post = document.getElementById(`${postId}`);
  post.appendChild(ul);
  data.map((comment) => {
    const li = document.createElement('li');
    li.textContent = `${comment.name}: ${comment.body}`;
    ul.appendChild(li);
  });
}

async function getData() {
  const response = await fetch(API_USERS);
  const data = await response.json();
  console.log(data);
  const list = createUserList(data);
  usersListContainer.appendChild(list);
}

getData();

async function getUserPosts() {
  const response = await fetch(`${API_POSTS}?user_id=${selectedUserId}`);
  const data = await response.json();
  console.log(data);
  const posts = createPostsList(data);
  postsListContainer.appendChild(posts);
}

async function getPostComments() {
  const response = await fetch(`${API_COMMENTS}?post_id=${selectedPostId}`);
  const data = await response.json();
  console.log(data);
  createPostCommentsList(data, selectedPostId);
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
    selectedUserId = e.target.classList.value.split(' ')[0];
    console.log(selectedUserId);
    postsListContainer.innerHTML = '';
    getUserPosts();
  }
}

usersListContainer.addEventListener('click', selectUser);

function selectPostComments(e) {
  const id = e.target.id;
  if (id > 0) {
    postSelect.textContent = `Posts Comments ${id}`;
    selectedPostId = id;
    getPostComments();
  }
  console.log(selectedPostId);
}

postsListContainer.addEventListener('click', selectPostComments);
