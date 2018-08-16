/**
 * @file
 * Sets group A/B for A/B Tests.
 */

function ABTest(feature) {
  this.init = () => {
    this.assignedGroups = this.getAllTests() || [];
    this.abTest = { feature };
    this.abTest.group = this.getABGroup() || this.setABGroup();

    this.applyUrlOverrideParams();

    if (!this.getABGroup()) {
      this.assignedGroups.push(this.abTest);
      this.writeToLocalStorage();
    }
    window.dataLayer.push({ event: 'executeABTest', abTest: this.abTest });
  };

  this.setABGroup = () => (Math.random() <= 0.5 ? 'a' : 'b');

  this.getABGroup = () => {
    const result = this.assignedGroups.find(obj => obj.feature === this.abTest.feature, this);
    return !!result && result.group;
  };

  this.applyUrlOverrideParams = () => {
    if (this.getUrlOverrideParam()) {
      const override = this.getUrlOverrideParam();
      this.assignedGroups = this.assignedGroups.filter(item => item.feature !== override.feature);
      this.assignedGroups.push(override);
      this.writeToLocalStorage();
    }
  };

  this.writeToLocalStorage = () => {
    window.localStorage.setItem('abTests', JSON.stringify(this.assignedGroups));
  };

  this.getUrlOverrideParam = () => {
    const url = new URL(window.location.href);
    const abGroup = {
      feature: url.searchParams.get('abFeature'),
      group: url.searchParams.get('abGroup'),
    };
    return !!abGroup.feature && !!abGroup.group ? abGroup : false;
  };

  this.getAllTests = () => JSON.parse(window.localStorage.getItem('abTests'));
  this.getTestObject = () => this.assignedGroups.find(item => item.feature === this.abTest.feature);

  this.showUserContent = () => {
    const abTest = Object.assign({ featureActive: true, abTestActive: true }, this.getTestObject());
    const abTestAllows = !abTest.abTestActive || this.abTest.group === 'a';
    return abTest.featureActive && abTestAllows;
  };

  this.init();
}

window.ABTest = ABTest;
