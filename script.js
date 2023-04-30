const API_USERS = 'https://gorest.co.in/public/v2/users?per_page=40&page=1';
const API_POSTS = 'https://gorest.co.in/public/v2/posts';
const API_COMMENTS = 'https://gorest.co.in/public/v2/comments';

const userListContainer = document.querySelector('.users-list-container');
const postListContainer = document.querySelector('.posts-list-container');

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
  const ul = document.createElement('ul');
  ul.classList.add('posts-list');
  data.map((post) => {
    const li = document.createElement('li');

    const p = document.createElement('p');
    p.textContent = post.title;
    p.classList.add(`post-id-${post.id}`);
    li.appendChild(p);

    const childUl = document.createElement('ul');
    li.appendChild(childUl);

    const childLi = document.createElement('li');
    childLi.textContent = post.body;

    childUl.appendChild(childLi);

    ul.appendChild(li);
  });
  return ul;
}

function createPostCommentsList(data, postId) {
  const ul = document.createElement('ul');
  ul.classList.add('comments-list');
  const post = document.querySelector(`.${postId}`);
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
  userListContainer.appendChild(list);
}

getData();

async function getUserPosts() {
  const response = await fetch(`${API_POSTS}?user_id=${selectedUserId}`);
  const data = await response.json();
  console.log(data);
  const posts = createPostsList(data);
  postListContainer.appendChild(posts);
}

async function getPostComments() {
  const response = await fetch(
    `${API_COMMENTS}?post_id=${selectedPostId.split('-')[2]}`
  );
  const data = await response.json();
  console.log(data);
  createPostCommentsList(data, selectedPostId);
}

function selectUser(e) {
  if (e.target.closest('li')) {
    // Тут я намагався уникнути бага. При виділенні декількох елементів клас додавався до всіх дочірніх елементів.
    // Пофіксив але не впевниний що продуктивність методу ок.\
    const childElements = userListContainer.querySelectorAll('li');
    childElements.forEach((element) => {
      element.classList.remove('selected-user');
    });
    e.target.classList.add('selected-user');
    selectedUserId = e.target.classList.value.split(' ')[0];
    console.log(selectedUserId);
    postListContainer.innerHTML = '';
    getUserPosts();
  }
}

userListContainer.addEventListener('click', selectUser);

function selectPost(e) {
  if (e.target.closest('p')) {
    selectedPostId = e.target.classList.value.split(' ')[0];
    console.log(selectedPostId);
    getPostComments();
  }
}

postListContainer.addEventListener('click', selectPost);
