/**
 * @author Alonso Jimenez <alonso_js@live.com>
 */

var Calculator  = function () {
  // Results section (for mobile animation purposes)
  this.el_resultsSection = document.querySelector('.results');
  // Number inputs (for key validation)
  this.el_numberInputs = document.querySelectorAll('.calculator__input-number');
  // Calc results
  this.principleAndInterest = 0;
  this.tax = 0;
  this.insurance = 0;
  this.monthlyPayment = 0;
  // Result elements
  this.el_principleAndInterest = document.querySelector('#principle-interest-result');
  this.el_tax = document.querySelector('#tax-result');
  this.el_insurance = document.querySelector('#insurance-result');
  this.el_monthlyPayment = document.querySelector('#total-monthly-payment-result');
  // Slider input functionality vars
  this.el_sliders = document.querySelectorAll('.calculator__range-input');
  // Input value vars
  this.el_yearsOfMortgage = document.querySelector('#years-of-mortgage');
  this.el_rateOfInterest = document.querySelector('#rate-of-interest');
  this.inputList = document.querySelectorAll('.calculator__input-number');
  this.submitButton = document.querySelector('#submit');
}

Calculator.prototype = {
  constructor: Calculator,

  // Initiates all events for the app
  eventsInit: function () {
    this.submitButton.addEventListener('click', this.startForm.bind(this));
    
    for (var i = 0; i < this.inputList.length; i++) {
      this.inputList[i].addEventListener('keydown', this.validateKey);
    }

    for (var i = 0; i < this.el_sliders.length; i++) {
      this.el_sliders[i].addEventListener('input', this.changeSliderValueBox);
      this.el_sliders[i].addEventListener('change', this.changeSliderValueBox); // Input doesn't work on IE11
    }
  },

  // Validates the input to only have numbers
  validateKey: function (e) {

    // Prevents the e, E, + and - to be printed
    if (e.key === 'e' || e.key === 'E' ||  e.key === '+' || e.key === '-') {
      e.preventDefault();
    }

    // If for some reason the user can use letters, this will erase them from the input
    if (!/^[0-9]*$/gm.test(this.value)) {
      this.value = this.value.replace(/\D/g,'');
    }
  },

  // Start all the form once the submit button has been pressed
  startForm: function () {
    if (this.validateForm()) {
      this.removeErrors();
      this.calculate();
      this.printResults();
      this.changeTextToSubmitButton();

      if (this.isMobile()) {
        this.mobile_showResultBox();
      }
    }
  },

  // Changes the value box in the slider
  changeSliderValueBox: function () {
    this.parentNode.childNodes[7].value = this.value;
    // Fill lower part of the slider track to be blue
    var val = (this.value - this.getAttribute('min')) / (this.getAttribute('max') - this.getAttribute('min'));
    this.style.backgroundImage = '-webkit-gradient(linear, left top, right top, '+ 'color-stop(' + val + ', #1091CC), '+ 'color-stop(' + val + ', #C5C5C5)'+ ')';
  },

  // Validates the form to be fulfilled
  validateForm: function () {
    var isValid = true;
    
    this.removeErrors();
    this.inputList.forEach(function(el) {
      if (el.value === '') { 
        this.showError(el);
        isValid = false;
      } 
    }.bind(this));

    return isValid;
  },

  // Removes the error once the form was submitted again
  removeErrors: function () {
    this.inputList.forEach(function(el) {
      var errorMsg = el.parentNode.childNodes[3]; // Export to a var for more readable code

      el.className = el.className.replace( /(?:^|\s)calculator--error(?!\S)/g , '' );
      errorMsg.className = errorMsg.className.replace( /(?:^|\s)calculator--show(?!\S)/g , '' );
    }.bind(this));
  },

  // Show errors caught in the input
  showError: function (el) { 
    el.className += ' calculator--error';
    el.parentNode.childNodes[3].className += ' calculator--show';
  },

  // Calculates all the values submitted by the user
  calculate: function () {
    var loanAmount = document.querySelector('#loan-amount');
    var annualTax = document.querySelector('#annual-tax');
    var annualInsurance = document.querySelector('#annual-insurance');

    this.principleAndInterest = ((this.el_rateOfInterest.value / 100) / 12) * loanAmount.value / (1-Math.pow((1 + ((this.el_rateOfInterest.value / 100)/12)),-this.el_yearsOfMortgage.value*12));
    this.tax = annualTax.value / 12; 
    this.insurance = annualInsurance.value / 12;
    this.monthlyPayment = this.principleAndInterest + this.tax + this.insurance;
  },

  
  // Prints the results of the operation
  printResults: function () { 
    this.el_principleAndInterest.innerHTML = this.principleAndInterest.toFixed(2);
    this.el_tax.innerHTML = this.tax.toFixed(2);
    this.el_insurance.innerHTML = this.insurance.toFixed(2);
    this.el_monthlyPayment.innerHTML = this.monthlyPayment.toFixed(2);

    var calcResults = document.querySelectorAll(".results--no-calc");

    // Makes result texts darker
    for (var i = 0; i < calcResults.length; i++) {
      calcResults[i].className = calcResults[i].className.replace( /(?:^|\s)results--no-calc(?!\S)/g , '' );
    }
  },


  // Check if mobile to show the animation for results panel
  isMobile: function () {
    if (window.innerWidth < 780) {
      return true;
    } else {
      return false;
    }
  },

  // Add class for results panel to get it animate
  mobile_showResultBox: function () { 
    this.el_resultsSection.className += ' results--animate';
    window.scrollTo(0,this.el_resultsSection.scrollHeight);
  },

  // Changes the inner text for the submit button after the first calculation
  changeTextToSubmitButton: function () {
    this.submitButton.innerHTML = 'RECALCULATE';
  }
}

// App init
var calc = new Calculator();

calc.eventsInit();