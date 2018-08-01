/**
 * @file
 * Sets group A/B for A/B Tests.
 */

function ABTest(feature) {
  this.init = () => {
    this.assignedGroups = this.getAbGroupFromLocalStorage() || [];
    this.abTest = {
      feature,
      featureActive: true,
      abTestActive: true,
    };
    this.abTest.group = this.getABGroup() || this.setABGroup();

    if (!this.getABGroup()) {
      this.assignedGroups.push(this.abTest);
      window.localStorage.setItem('abTests', JSON.stringify(this.assignedGroups));
    }
    window.dataLayer.push({ event: 'executeABTest', abTest: this.abTest });
  };

  this.getAbGroupFromLocalStorage = () => JSON.parse(window.localStorage.getItem('abTests'));

  this.setABGroup = () => (Math.random() <= 0.5 ? 'a' : 'b');

  this.getABGroup = () => {
    const result = this.assignedGroups.find(obj => obj.feature === this.abTest.feature, this);
    return !!result && result.group;
  };

  this.init();
}

window.ABTest = ABTest;
