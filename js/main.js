// 1
function createElemWithText(elementName = 'p', textContent = '', className) {
    const element = document.createElement(elementName);
    element.textContent = textContent;

    if (className) {
        element.className = className;
    }
    return element;
};
// 2
function createSelectOptions(users) {
    if (!users) {
        return;
    }

    const options = [];

    for (const user of users) {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        options.push(option);
    }
    return options;
};
// 3
function toggleCommentSection(postId) {
    if (!postId) {
      return;
    }
  
    const section = document.querySelector(`[data-post-id="${postId}"]`);
  
    if (!section) {
      return null;
    }  
    section.classList.toggle('hide');
    return section;
};
// 4 
function toggleCommentButton(postId) {
    if (!postId) {
        return;
    }

    const button = document.querySelector(`button[data-post-id="${postId}"]`);

    if (!button) {
        return null;
    }
    button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
    return button;
};
// 5
function deleteChildElements(parentElement) {
    if (!parentElement || !parentElement.tagName) {
        return undefined;
    }
    while (parentElement.lastElementChild) {
        parentElement.removeChild(parentElement.lastElementChild); 
    }
    return parentElement;
};
// 6
function addButtonListeners() {
    const mainElement = document.querySelector('main');
    const buttons = mainElement ? mainElement.querySelectorAll('button') : [];

    if (buttons.length > 0) {
        buttons.forEach(button => {
        const postId = button.dataset.postId;
  
        if (postId) {
          button.addEventListener('click', event => {
            toggleComments(event, postId);
            });
            }
        });
    }
    return buttons;
}
// 7
function removeButtonListeners() {
    const mainElement = document.querySelector('main');
    const buttons = mainElement ? mainElement.querySelectorAll('button') : [];
  
    if (buttons.length > 0) {
        buttons.forEach(button => {
        const postId = button.dataset.id;
  
        if (postId) {
            const clickHandler = () => {
            toggleComments(event, postId);
            };
          button.removeEventListener('click', clickHandler);
        }
        });
    }  
    return buttons;
}
// 8
function createComments(commentsData) {
    if (!commentsData) {
        return;
    }
    const fragment = document.createDocumentFragment();
  
    commentsData.forEach(comment => {
        const article = document.createElement('article');
  
        const h3 = createElemWithText('h3', comment.name);
        const bodyParagraph = createElemWithText('p', comment.body);
        const emailParagraph = createElemWithText('p', `From: ${comment.email}`);
  
        article.appendChild(h3);
        article.appendChild(bodyParagraph);
        article.appendChild(emailParagraph);
  
        fragment.appendChild(article);
    });  
    return fragment;
};
// 9
function populateSelectMenu(usersData) {
    if (!usersData) {
        return;
    }
    const selectMenu = document.getElementById('selectMenu');
  
    const options = createSelectOptions(usersData);
  
    options.forEach(option => {
      selectMenu.appendChild(option);
    });
  
    return selectMenu;
};
// 10
async function getUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');

        const userData = await response.json();
        return userData;
    }   catch(error) {
        console.error(error);
        throw error;
    }
};
// 11
async function getUserPosts(userId) {
    if (!userId) {
        return;
    }
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);

        const userPosts = await response.json();
        return userPosts;
    }   catch(error) {
        console.error(error)
        throw error;
    }
};
// 12
async function getUser(userId) {
    if (!userId) {
        return;
    }
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

        const userResponse = await response.json();
        return userResponse;
    }   catch(error) {
        console.error(error)
        throw error;
    }
};
// 13
async function getPostComments(postId) {
    if (!postId) {
        return;
    }
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);

        const postComments = await response.json();
        return postComments;
    }   catch(error) {
        console.error(error)
        throw error;
    }
};
// 14
async function displayComments(postId) {
    if (!postId) {
        return;
    }
    const comments = await getPostComments(postId);
    const section = document.createElement('section');
    section.dataset.postId = postId;
    section.classList.add('comments', 'hide');

    const fragment = createComments(comments)
    section.appendChild(fragment);

    return section;
};
// 15
async function createPosts(postsData) {
    if (!postsData) {
        return;
    }
    const fragment = document.createDocumentFragment();

    for (const post of postsData) {
        const article = document.createElement('article');
        const title = createElemWithText('h2', post.title);
        const body = createElemWithText('p', post.body);
        const postId = createElemWithText('p', `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const authorInfo = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        const catchPhrase = createElemWithText('p', author.company.catchPhrase);

        const button = document.createElement('button');
        button.textContent = 'Show Comments';
        button.dataset.postId = post.id;

        article.appendChild(title);
        article.appendChild(body);
        article.appendChild(postId);
        article.appendChild(authorInfo);
        article.appendChild(catchPhrase);
        article.appendChild(button);

        const section = await displayComments(post.id);
        article.appendChild(section);

        fragment.appendChild(article);
    }
    return fragment;
}
// 16
async function displayPosts(postsData) {
    const mainElement = document.querySelector('main');
  
    if (!postsData) {
      const element = document.createElement('p');
      element.textContent = 'Select an Employee to display their posts.';
      element.classList.add('default-text');
      mainElement.appendChild(element);
      return element;
    }
  
    const fragment = await createPosts(postsData);
    mainElement.appendChild(fragment);
    return fragment;
}
// 17
function toggleComments(event, postId) {
    if (!event, !postId) {
        return;
    }

    event.target.listener = true;  
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);

    return [section, button];
}
// 18
async function refreshPosts(postsData) {
    if (!postsData) {
        return;
    }
    const removeButtons = removeButtonListeners();
    const mainElement = document.querySelector('main');
    const main = deleteChildElements(mainElement);
    const fragment = await displayPosts(postsData);
    const addButtons = addButtonListeners();

    return [removeButtons, main, fragment, addButtons];
};
// 19
const selectMenuChangeEventHandler = async (event) => {
    if (!event) {
        return;
    }
        const userId = event?.target?.value || 1;
        const posts = await getUserPosts(userId);
        const refreshPostsArray = await refreshPosts(posts);
        return [userId, posts, refreshPostsArray];
};
// 20 
async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}
// 21 
function initApp() {
    initPage().then(([users, select]) => {
        const selectMenu = document.getElementById("selectMenu");
        if (selectMenu) {
            selectMenu.appendChild(select);
            selectMenu.addEventListener("change", selectMenuChangeEventHandler, false);
        }
    });
}

document.addEventListener("DOMContentLoaded", initApp, false);
