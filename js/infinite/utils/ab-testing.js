/**
 * @file
 * Sets group A/B for A/B Tests.
 */

function ABTest(feature) {
  this.init = function() {
    this.assignedGroups = this.getAllTests() || [];
    this.abTest = { feature: feature };
    this.abTest.group = this.getABGroup() || this.setABGroup();

    this.applyUrlOverrideParams();

    if (!this.getABGroup()) {
      this.assignedGroups.push(this.abTest);
      this.writeToLocalStorage();
    }
    window.dataLayer.push({ event: 'executeABTest', abTest: this.abTest });
  }.bind(this);

  this.setABGroup = function() {
    return Math.random() <= 0.5 ? 'a' : 'b';
  };

  this.getABGroup = function() {
    const result = this.assignedGroups.find(
      function(obj) {
        return obj.feature === this.abTest.feature;
      }.bind(this),
      this
    );
    return !!result && result.group;
  }.bind(this);

  this.applyUrlOverrideParams = function() {
    if (this.getUrlOverrideParam()) {
      const override = this.getUrlOverrideParam();
      this.assignedGroups = this.assignedGroups.filter(function(item) {
        return item.feature !== override.feature;
      });
      this.assignedGroups.push(override);
      this.writeToLocalStorage();
    }
  }.bind(this);

  this.writeToLocalStorage = function() {
    window.localStorage.setItem('abTests', JSON.stringify(this.assignedGroups));
  }.bind(this);

  this.getUrlOverrideParam = function() {
    const url = new URL(window.location.href);
    const abGroup = {
      feature: url.searchParams.get('abFeature'),
      group: url.searchParams.get('abGroup'),
    };
    return !!abGroup.feature && !!abGroup.group ? abGroup : false;
  };

  this.getAllTests = function() {
    return JSON.parse(window.localStorage.getItem('abTests'));
  };
  this.getTestObject = function() {
    return this.assignedGroups.find(
      function(item) {
        return item.feature === this.abTest.feature;
      }.bind(this)
    );
  }.bind(this);

  this.showUserContent = function() {
    const abTest = Object.assign(
      { featureActive: true, abTestActive: true },
      this.getTestObject()
    );
    const abTestAllows = !abTest.abTestActive || this.abTest.group === 'a';
    return abTest.featureActive && abTestAllows;
  }.bind(this);

  this.init();
}

window.ABTest = ABTest;
