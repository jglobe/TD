const BOOKMARKS_TAGS = {
  assignment: 'assignment',
  exam: 'exam',
  quiz: 'quiz'
};

const COLORS = {
  green: {
    colorName: 'Green',
    value: '#5fa263',
    background: '#e8f5ea'
  },
  blue: {
    colorName: 'Blue',
    value: '#5f92de',
    background: '#e4f2fd'
  },
  rose: {
    colorName: 'Rose',
    value: '#bc1c57',
    background: '#fce4ec'
  },
  yellow: {
    colorName: 'Yellow',
    value: '#e8b02f',
    background: '#fff8e2'
  },
};

const CUSTOM_TAGS = {
  custom_gk_324: {
    tagName: 'GK 324',
    tagColor: COLORS.green
  },
  custom_rtf_370: { 
    tagName: 'RTF 370',
    tagColor: COLORS.blue
  },
  custom_lat_323:{
    tagName: 'LAT 323',
    tagColor: COLORS.rose
  },
  custom_his_441:{
    tagName: 'HIS 441',
    tagColor: COLORS.yellow
  },
};

const WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August', 
  'September', 
  'October',
  'November',
  'December',
];

function getDate(timecode) {
  let date = new Date(timecode)
  date = `Due ${WEEK[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
  return date;
}

function encodeDate(date) {
  let timecode = Date.parse(date);
  return timecode;
}

function addBookmark(mark, index) {
  const template = 
    `<li class="bookmark">
        <div class="bookmark_container">
          <ul class="bookmark_tags">
            ${mark.customTag ? (`
              <li 
                class="customTag tag"
                style="
                  color:${mark.customTag.tagColor.value};
                  background-color:${mark.customTag.tagColor.background}
                "
              >
                <span class="tag_name">
                  ${mark.customTag.tagName}
                </span>
              </li>`) : ''
            }
            <li class="tag">
              <span class="tag_name">${mark.tag}</span>
            </li>
          </ul>
            <div class="title_container">
              <h3 class="bookmark_title">
                ${mark.title}
              </h3>
            </div>
          <p class="bookmark_date">
            ${getDate(mark.date)}
          </p>
          <div class="bookmarkOptions">
            <button type="button" class="bookmarkOptions_button">
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div class="bookmarkOptions_window">
              <div class="bookmarkOptions_list">
                <button class="bookmarkOptions_delete secondary_button" onclick="deleteBookmark(${(index)})">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>`

    BOOKMARKS_LIST.innerHTML += template;
}

let bookmarks = [
  {
    tag: BOOKMARKS_TAGS.assignment,
    customTag: CUSTOM_TAGS.custom_gk_324,
    title:'Analyze Article Submission',
    date: 1667682000000
  },
  {
    tag: BOOKMARKS_TAGS.assignment,
    customTag: CUSTOM_TAGS.custom_rtf_370,
    title:'Final Script Revision % Review',
    date: 1667768400000
  },
  {
    tag: BOOKMARKS_TAGS.exam,
    customTag: CUSTOM_TAGS.custom_lat_323,
    title:'Section #4 Comprehension Test',
    date: 1667682000000
  },
  {
    tag: BOOKMARKS_TAGS.exam,
    customTag: CUSTOM_TAGS.custom_his_441,
    title:'Analyze Article Submission',
    date: 1667941200000
  },
  {
    tag: BOOKMARKS_TAGS.quiz,
    customTag: null,
    title:'Analyze Article Submission',
    date: 1668027600000
  },
];

const BODY = document.querySelector('body');
const BOOKMARKS_LIST = document.querySelector('.bookmarks_list');
const ADD_BOOKMARKS_BUTTON = document.querySelector('.bookmarks_add');

ADD_BOOKMARKS_BUTTON.addEventListener('click', () => openModal());

function validateBookmark(form) {
  const formData = new FormData(form);
  const errors = {};
  let data = {};

  let title = formData.get('bookmark_title').trim();
  title ? data.title = title : errors.bookmark_title = 'Title can\'t be empty';

  let tag = formData.get('bookmark_tag');
  tag ? data.tag = tag : errors.bookmark_tag = 'Tag must be selected';

  let customTagName = formData.get('custom_name');
  let customTagColor = formData.get('custom_color');

  let tagLength = customTagName.split('').length;

  if (tagLength > 0 && tagLength <= 10) {
    if (isCustomTagExist(customTagName)) {
      errors.custom_name = 'Custom tag already exist';
    } else {
      data.customTagName = customTagName;
      data.customTagColor = customTagColor;
    }
  } else if(tagLength > 10) {
    errors.custom_name = 'Tag must be less than 10 characters and spaces';
  }

  let date = formData.get('bookmark_date');
  date ? data.date = date : errors.bookmark_date = 'Only the date remains!';

  let result = Object.keys(errors).length === 0 && errors.constructor === Object ?
  { success: true, data: data } : { success: false, errors: errors };
 
  return result;
}

function isCustomTagExist(tag) {
  for (let existedTag of Object.values(CUSTOM_TAGS)) {
    if (existedTag.tagName.toUpperCase() === tag.toUpperCase()) {
      return true;
    }
  }
  return false;
}

function openModal() {
  const MODAL_POSITION = document.querySelector('#modal_position');

  let defaultTags = '';
  let defaultColors = '';

  for (let tag of Object.values(BOOKMARKS_TAGS)) {
    defaultTags += 
      `<input type="radio" name="bookmark_tag" class="form_input" id="tag_${tag}" value="${tag}">
      <label for="tag_${tag}">${tag.toUpperCase()}</label>`
  }

  for (let color of Object.values(COLORS)) {
    defaultColors +=
      `<option 
        value="${color.colorName}"
        style="
          color:${color.value};
          background:${color.background};
        "
      >
        ${color.colorName}
      </option>`
  }

  let template =`
    <div class="modal">
      <div class="modal_background">
        <form class="newBookmark" id="create_bookmark_form">
          <h2 class="bookmarks_title">Add new bookmark</h2>
          <label for="newBookmark_title" class="form_label">What do you want to do?</label>
          <div class="hint_box">
            <input id="newBookmark_title" name="bookmark_title" class="form_input" type="text" placeholder="Get a job">
            <span class="hint_text"></span>
          </div>  
          <label for="newBookmark_tag" class="form_label">Choose a tag!</label>
          <div class="newBookmarks_tags hint_box">
            ${defaultTags}
            <span class="hint_text"></span>
          </div>
          <label for="newBookmark_type__custom" class="form_label">Custom tag?</label>
          <div class="newBookmark_type__custom hint_box">
            <input type="text" id="newBookmark_name" class="form_input" name="custom_name" placeholder="Not required">
            <select class="form_select" name="custom_color">
              ${defaultColors}
            </select>
            <span class="hint_text"></span>
          </div>
          <label for="newBookmark_date" class="form_label">Let's think about when...</label>
          <div class="newBookmark_date hint_box">
            <input type="date" name="bookmark_date" class="form_input">
            <span class="hint_text"></span>
          </div>
          <div class="modal_buttons">
            <button
              class="bookmark_submit primary_button"
              type="button"
            >
              Add New Bookmark
            </button>
          </div>
        </form>
      </div>
      <button class="modal_button__close">
      </button>
    </div>`;

  MODAL_POSITION.innerHTML += template;

  BODY.style.overflow = 'hidden';

  const CLOSE_MODAL_BUTTON = document.querySelector('.modal_button__close');
  const SUBMIT_BOOKMARK = document.querySelector('.bookmark_submit');
  const CREATE_BOOKMARK_FORM = document.querySelector('#create_bookmark_form');

  CLOSE_MODAL_BUTTON.addEventListener('click', e => {
    e.preventDefault();
    closeModal();
  });

  SUBMIT_BOOKMARK.addEventListener('click', e => {
    e.preventDefault();
    let bookmark = validateBookmark(CREATE_BOOKMARK_FORM);
    bookmark.success ? createBookmark(bookmark.data) : giveErrors(bookmark.errors);
  });
}

function closeModal() {
  const MODAL = document.querySelector('.modal');
  MODAL.remove();
  BODY.style.overflow = 'unset'; 
}

function createBookmark(data) {
 let bookmark = {
    tag: data.tag,
    title: data.title,
    date: encodeDate(data.date)
  }
  data.customTagName ? bookmark.customTag = createCustomTag(data.customTagName, data.customTagColor) : null;
  bookmarks.push(bookmark);
  addBookmark(bookmark);
  closeModal();
}

function giveErrors(errors) {
  const MODAL = document.querySelector('.modal');
  let allInputs = MODAL.querySelectorAll('.form_input');

  allInputs.forEach((input) => {
    let box = input.closest('.hint_box');
    if(errors.hasOwnProperty(input.name)) {
      box.querySelector('.hint_text').innerText = errors[input.name];
    } else {
      box.querySelector('.hint_text').innerText = '';
    }
  });
}

function createCustomTag(name, color) {
  let tagName = name.toUpperCase();
  let tagKey = `custom_${name.toLowerCase().replaceAll(' ','_')}`;
  let tagColor = color.toLowerCase();

  CUSTOM_TAGS[tagKey] = { tagName, tagColor: COLORS[tagColor] };
  return { tagName, tagColor: COLORS[tagColor] }; 
}

function deleteBookmark(index) {
  bookmarks.splice(index, 1);
  renderBookmarks(bookmarks);
}

function renderBookmarks(bookmarks) {
  BOOKMARKS_LIST.innerHTML = '';
  bookmarks.forEach((mark, index) => addBookmark(mark, index));
}

document.addEventListener('load', renderBookmarks(bookmarks));