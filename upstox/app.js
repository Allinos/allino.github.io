var is_reffered = "no";

function addClass(element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += " " + className;
  }
}

function removeClass(element, className) {
  var _classRegEx = new RegExp(
    "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
    "gi"
  );
  if (element.classList) {
    element.classList.remove(className);
  } else {
    element.className = element.className.replace(_classRegEx, " ");
  }
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, secs) {
  document.cookie =
    cname + "=" + cvalue + ";" + "max-age=" + secs + ";path=/;domain=" + location.hostname + ";SameSite=strict;Secure";
}

function clearCookie(cname) {
  // This one clears cookie on upstox.com
  document.cookie = cname + "=; path=/; max-age=0;";
  // and this one clears cookie on .upstox.com
  document.cookie = cname + "=; path=/; max-age=0; domain=" + location.hostname;
}

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  try {
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  } catch (e) {
    console.log(e);
    return;
  }
}

function destroyCookies() {
  var allUTMParams = [...utmParams, ...extraParams];
  allUTMParams.forEach((param) => {
    if (getCookie(param)) {
      clearCookie(param);
    }
  });
}

function isEmailPhoneInUrl() {
  if (
    getParameterByName("email", window.location) &&
    getParameterByName("number", window.location)
  ) {
    return true;
  }
  return false;
}

const baseURLS = {
  'proLogin': {
    'uat': 'https://uat-login.upstox.com/',
    'prod': 'https://login.upstox.com/'
  },
  'loginRedirect': {
    'uat': 'https://uat.upstox.com/new-demat-account/profile',
    'prod': 'https://upstox.com/new-demat-account/profile'
  }
}

function getBaseURL(urlConfig) {
  const baseUrlUat = urlConfig.uat;
  const baseUrlProd = urlConfig.prod;
  const baseURL = location.hostname === "upstox.com" ? baseUrlProd : baseUrlUat;
  return baseURL;
}

function getUpstoxClientID() {
  const clientIDUat = 'OBD-wQQs6Scx9qdJU7aqCI00tnok';
  const clientIDProd = 'OBD-3baSp793TTJwPwljCm9C5So2';
  const clientID = location.hostname === "upstox.com" ? clientIDProd : clientIDUat;
  return clientID
}

const utmParams = [
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_referer",
  "utm_source",
  "utm_term",
  "utm_unique_id"
];

const extraParams = [
  "utm_creative",
  "utm_device",
  "utm_adgroup",
  "adset",
  "utm_placement",
  "site",
  "fbclid",
  "gclid",
  "utm_source_rm",
  "utm_term_rm",
  "utm_creative_rm",
  "utm_campaign_rm",
  "utm_device_rm",
  "utm_content_rm",
  "utm_adgroup_rm",
  "adset_rm",
  "utm_placement_rm",
  "utm_medium_rm",
  "site_rm",
  "gclid_rm",
  "fbclid_rm",
];

const userDataParams = [
  "source",
  "upstoxemail",
  "upstoxphone",
  "landing_page",
  "email",
  "number"
]

const workflowParams = [
  "workflow",
  "workflow_version",
  "f",
  "redirect_uri",
  "client_id",
  "referral_code"
]

const allowedQueryParams = [
  ...utmParams,
  ...extraParams,
  ...userDataParams,
  ...workflowParams
]

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
// build list of allowed query params
let allowedParamsObj = {};
for (param in params) {
  if (allowedQueryParams.includes(param)) {
    const key = param === "f" ? "referral_code" : param;
    allowedParamsObj[key] = encodeURIComponent(params[param]);
  }
}
// add redirect_uri and client_id to query params since they always have to be present
allowedParamsObj["redirect_uri"] = getBaseURL(baseURLS.loginRedirect);
allowedParamsObj["landing_page"] = (params['landing_page']) ? params['landing_page'] : 'open-demat-account-v2';
allowedParamsObj["client_id"] = getUpstoxClientID();

const queryString = Object.keys(allowedParamsObj).map(key => key + '=' + allowedParamsObj[key]).join('&');

function proceedWithLazyLogin(event) {
  event.preventDefault();
  const phone = event.target.querySelector(".txtcontact").value;
  const mobileGrp =event.target.parentElement.querySelector(".error-msg");
  if (validateMobile(phone,mobileGrp)) {
    mobileGrp.classList.remove("invalid-mobile");
    setCookie('lead_phone_number', phone, 300);  // set cookie expiration to 5 minutes
    location.href = getBaseURL(baseURLS.proLogin) + '?' + queryString;
  }
}


function validateMobile(mobileNumber,mobileGrp) {
  var val = mobileNumber;
  if (/^(6|7|8|9)\d{9}$/.test(val)) {
    if (val.startsWith("0")) {
      addClass(mobileGrp, "invalid-mobile");
      return false;
    } else {
      return true;
    }
  } else {
    addClass(mobileGrp, "invalid-mobile");
    return false;
  }
}

function isNumber(evt) {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}


let referralCode = getParameterByName("f", window.location);
if (referralCode) {
  referralCode = referralCode.toUpperCase();
}


const uat = 'https://service-uat.upstox.com';
const prod = 'https://service.upstox.com';

function hasClass(target, className) {
  return new RegExp("(\\s|^)" + className + "(\\s|$)").test(target.className);
}

function readmoreFooter() {
  var _this = document.getElementById("footer_readmore"),
    hidden_footer = document.getElementById("hidden_footer"),
    moretext = "Read More",
    lesstext = "Read Less";
  if (hasClass(_this, "less")) {
    removeClass(_this, "less");
    hidden_footer.style.display = "none";
    _this.innerHTML = moretext;
  } else {
    addClass(_this, "less");
    hidden_footer.style.display = "block";
    _this.innerHTML = lesstext;
  }

  return false;
}

// faq 

$(document).ready(function () {
  $('.pricing_help_section').on('click', '.panel-trigger', function () {
    var val = $(this).attr('val');
    $('.pricing_help_section').find(`.panel-collapse:not(${val})`).slideUp('fast');
    var inactiveTab = $('.pricing_help_section').find(`.panel-trigger:not([val="${val}"])`);
    $(this).toggleClass('collapsed');
    $(val).slideToggle('fast');
    if (inactiveTab.hasClass('collapsed')) {
      inactiveTab.removeClass('collapsed');
    }

  });

  $('.view-more-button').on('click', function () {
    $('#more-faqs').removeClass('d-none');
    $('.view-more-button').addClass('d-none');
    $('.view-less-button').removeClass('d-none');
  });

  $('.view-less-button').on('click', function () {
    $('#more-faqs').addClass('d-none');
    $('.view-less-button').addClass('d-none');
    $('.view-more-button').removeClass('d-none');
  });

  $('body').on("click", function (event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  });

  /* Start input field highlight on focus first fold*/
  $('.txtcontact').focus(function () {
    $(this).parent().addClass('clicked');
  });

  $('.txtcontact').blur(function () {
    $(this).parent().removeClass('clicked');
  });

  /* END input field highlight on focus first fold*/

  /* Start Footer sticky bar hide show */
  const firstSection = $(".first-fold-with-banner");
  const stickyBanner = $(".oda-bottom-footer-bar");

  $(window).scroll(function () {
    if ($(window).scrollTop() > firstSection.height()) {
      stickyBanner.css("display", "block"); // Show the sticky banner
    } else {
      stickyBanner.css("display", "none"); // Hide the sticky banner
    }
  });
  /* END Footer sticky bar hide show */


  $('.moreless-button').click(function() {
    var parentDiv = $(this).closest('.demat-content');
    parentDiv.find('.moretext').slideToggle();
  
    if ($(this).text() == "Read Less") {
      $(this).text("Read More");
      parentDiv.find('.moretext-show').show();
      parentDiv.removeClass('new-read');
    } else {
      $(this).text("Read Less");
      parentDiv.find('.moretext-show').hide();
      parentDiv.addClass('new-read');
    }
  });

});