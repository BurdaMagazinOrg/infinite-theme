function ABTest(feature) {
  this.init = () => {
    this.assignedGroups = JSON.parse(window.localStorage.getItem('abTests')) || [];
    this.abTest = {
      feature,
      featureActive: true,
      abTestActive: true,
    };
    this.abTest.group = this.getABGroup() || this.setABGroup();

    Object.assign(this.abTest, this.getTestFromLocalStorage());

    if (!this.getABGroup()) {
      this.assignedGroups.push(this.abTest);
      window.localStorage.setItem('abTests', JSON.stringify(this.assignedGroups));
    }
    window.dataLayer.push({ event: 'executeABTest', abTest: this.abTest });
  };

  this.getTestFromLocalStorage = () => this.assignedGroups.find(item => item.feature === this.abTest.feature);

  this.setABGroup = () => (Math.random() <= 0.5 ? 'a' : 'b');

  this.getABGroup = () => {
    const result = this.assignedGroups.find(obj => obj.feature === this.abTest.feature, this);
    return !!result && result.group;
  };

  this.showUserContent = () => {
    const abSettingsAllow = !this.abTest.abTestActive
    || (this.abTest.abTestActive && this.getTestFromLocalStorage().group === 'a');
    const active = this.abTest.featureActive && abSettingsAllow;
    return abSettingsAllow && active;
  };

  this.init();
}

window.ABTest = ABTest;
