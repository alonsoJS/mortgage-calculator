var Calculator  = function () {
  // Results section (for mobile animation purposes)
  this.el_resultsSection = document.querySelector('.results');
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
  this.inputList = [
    document.querySelector('#loan-amount'),
    document.querySelector('#annual-tax'),
    document.querySelector('#annual-insurance')
  ];
  this.submitButton = document.querySelector('#submit');
}

Calculator.prototype = {
  constructor: Calculator,

  eventsInit: function () {
    this.submitButton.addEventListener('click', function () {
      if (this.validateForm()) {
        this.removeErrors();
        this.calculate();
        this.printResults();

        if (this.isMobile()) {
          this.mobile_showResultBox();
        }
      }
    }.bind(this));

    for (var i = 0; i < this.el_sliders.length; i++) {
      this.el_sliders[i].addEventListener('input', this.changeSliderValueBox);
      this.el_sliders[i].addEventListener('change', this.changeSliderValueBox); // Input doesn't work on IE11
    }
  },

  changeSliderValueBox: function () {
    this.parentNode.childNodes[7].value = this.value;
  },

  validateForm: function () {
    var isValid = true;

    this.inputList.forEach(function(el) {
      if (el.value === '') { 
        this.showError(el);
        isValid = false;
      }
    }.bind(this));

    return isValid;
  },

  removeErrors: function () {
    this.inputList.forEach(function(el) {
      var errorMsg = el.parentNode.childNodes[3]; // Export to a var for more readable code

      el.className = el.className.replace( /(?:^|\s)calculator--error(?!\S)/g , '' );
      errorMsg.className = errorMsg.className.replace( /(?:^|\s)calculator--show(?!\S)/g , '' );
    }.bind(this));
  },

  showError: function (el) { 
    el.className += ' calculator--error';
    el.parentNode.childNodes[3].className += ' calculator--show';
  },

  calculate: function () {
    // Input List var
    // 0: Loan Amount
    // 1: Annual Tax
    // 2: Annual Insurance
    this.principleAndInterest = ((this.el_rateOfInterest.value / 100) / 12) * this.inputList[0].value / (1-Math.pow((1 + ((this.el_rateOfInterest.value / 100)/12)),-this.el_yearsOfMortgage.value*12));
    this.tax = this.inputList[1].value / 12; 
    this.insurance = this.inputList[2].value / 12;
    this.monthlyPayment = this.principleAndInterest + this.tax + this.insurance;
  },

  printResults: function () { 
    this.el_principleAndInterest.innerHTML = this.principleAndInterest.toFixed(2);
    this.el_tax.innerHTML = this.tax.toFixed(2);
    this.el_insurance.innerHTML = this.insurance.toFixed(2);
    this.el_monthlyPayment.innerHTML = this.monthlyPayment.toFixed(2);
  },

  isMobile: function () {
    if (window.innerWidth < 780) {
      return true;
    } else {
      return false;
    }
  },

  mobile_showResultBox: function () { 
    this.el_resultsSection.className += ' results--animate';
  }
}

// App init
var calc = new Calculator();

calc.eventsInit();