/**
 * @file
 * Sets group A/B for A/B Tests.
 */

function ABTest(feature) {
  this.init = () => {
    this.assignedGroups = this.getAllTests() || [];
    this.abTest = { feature };
    this.abTest.group = this.getABGroup() || this.setABGroup();

    if (!this.getABGroup()) {
      this.assignedGroups.push(this.abTest);
      window.localStorage.setItem('abTests', JSON.stringify(this.assignedGroups));
    }
    window.dataLayer.push({ event: 'executeABTest', abTest: this.abTest });
  };

  this.setABGroup = () => (Math.random() <= 0.5 ? 'a' : 'b');

  this.getABGroup = () => {
    const result = this.assignedGroups.find(obj => obj.feature === this.abTest.feature, this);
    return !!result && result.group;
  };

  this.getAllTests = () => JSON.parse(window.localStorage.getItem('abTests'));
  this.getTestObject = () => this.assignedGroups.find(item => item.feature === this.abTest.feature);

  this.showUserContent = () => {
    const abTest = this.getTestObject();
    const abTestAllows = !abTest.abTestActive || this.abTest.group === 'a';
    return abTest.featureActive && abTestAllows;
  };

  this.init();
}

window.ABTest = ABTest;
