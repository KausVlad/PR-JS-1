const API_USERS = 'https://gorest.co.in/public/v2/users?per_page=10&page=1';
const API_POSTS = 'https://gorest.co.in/public/v2/posts';

const srrt = 'https://gorest.co.in/public/v2/users/1301436';
const srrt2 = 'https://gorest.co.in/public/v2/posts?user_id=1301436';

const userListContainer = document.querySelector('.users-list-container');
const postListContainer = document.querySelector('.posts-list-container');

let selectedUserId = undefined;

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
    li.textContent = post.title;

    const childUl = document.createElement('ul');
    li.appendChild(childUl);

    const childLi = document.createElement('li');
    childLi.textContent = post.body;

    childUl.appendChild(childLi);

    ul.appendChild(li);
  });
  return ul;
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

function checkUserSelect(e) {
  if (e.target.querySelectorAll('li').length === 0) {
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

userListContainer.addEventListener('click', checkUserSelect);
