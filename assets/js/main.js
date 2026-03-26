// Santa Greg of the Marshwalk - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  
  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }
  
  // Close mobile menu when clicking a link
  const navLinkItems = document.querySelectorAll('.nav-links a');
  navLinkItems.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.classList.remove('active');
      const icon = navToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });
  
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Navbar background on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    } else {
      navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
  });

  // Load Google Calendar events
  loadCalendarEvents();
  
});

// Google Calendar Events
function loadCalendarEvents() {
  const container = document.getElementById('events-list');
  if (!container) return;

  const config = window.SANTA_CONFIG || {};
  if (!config.calendarId || !config.apiKey) {
    container.innerHTML =
      '<div class="events-error"><i class="fas fa-exclamation-circle"></i>' +
      '<p>Calendar not configured yet. Check back soon!</p></div>';
    return;
  }

  const now = new Date().toISOString();
  const url = 'https://www.googleapis.com/calendar/v3/calendars/' +
    encodeURIComponent(config.calendarId) +
    '/events?key=' + encodeURIComponent(config.apiKey) +
    '&timeMin=' + encodeURIComponent(now) +
    '&maxResults=' + (config.maxEvents || 10) + '&singleEvents=true&orderBy=startTime';

  fetch(url)
    .then(function(res) {
      if (!res.ok) throw new Error('Calendar request failed');
      return res.json();
    })
    .then(function(data) {
      renderEvents(container, data.items || [], config);
    })
    .catch(function() {
      container.innerHTML =
        '<div class="events-error"><i class="fas fa-exclamation-circle"></i>' +
        '<p>Unable to load events right now. Please try again later.</p></div>';
    });
}

function renderEvents(container, events, config) {
  if (!events.length) {
    container.innerHTML =
      '<div class="events-empty"><i class="fas fa-calendar-xmark"></i>' +
      '<p>No upcoming events scheduled. Stay tuned!</p></div>';
    return;
  }

  var html = '';
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  events.forEach(function(event) {
    var startStr = event.start.dateTime || event.start.date;
    var start = new Date(startStr);
    var isAllDay = !event.start.dateTime;

    var month = months[start.getMonth()];
    var day = start.getDate();
    var weekday = days[start.getDay()];

    var timeStr = '';
    if (!isAllDay) {
      timeStr = start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      if (event.end && event.end.dateTime) {
        var end = new Date(event.end.dateTime);
        timeStr += ' – ' + end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      }
    } else {
      timeStr = 'All Day';
    }

    var location = event.location || '';

    var eventUrl = event.htmlLink || '#';

    html += '<a class="event-item" href="' + escapeAttr(eventUrl) + '" target="_blank" rel="noopener">';
    html += '<div class="event-date-badge">';
    html += '<span class="event-month">' + month + '</span>';
    html += '<span class="event-day">' + day + '</span>';
    html += '<span class="event-weekday">' + weekday + '</span>';
    html += '</div>';
    html += '<div class="event-details">';
    html += '<div class="event-title">' + escapeHtml(event.summary || 'Untitled Event') + '</div>';
    html += '<div class="event-meta">';
    html += '<span><i class="fas fa-clock"></i> ' + escapeHtml(timeStr) + '</span>';
    if (location) {
      html += '<span><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(location) + '</span>';
    }
    html += '</div></div></a>';
  });

  var calendarUrl = 'https://calendar.google.com/calendar/embed?src=' +
    encodeURIComponent(config.calendarId);
  html += '<div class="events-footer">';
  html += '<a href="' + calendarUrl + '" target="_blank" rel="noopener" class="btn btn-primary">';
  html += '<i class="fas fa-calendar"></i> View Full Calendar</a></div>';

  container.innerHTML = html;
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

// Lightbox Functions
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  // Check if image exists by attempting to load it
  const testImg = new Image();
  testImg.onload = function() {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  testImg.onerror = function() {
    // Image doesn't exist, don't open lightbox
    console.log('Image not found:', src);
  };
  testImg.src = src;
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});
