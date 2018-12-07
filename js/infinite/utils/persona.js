window.Persona = (function Persona() {
  const that = {};
  const channelTypes = ['channel', 'subChannel'];
  let personaCollection;

  const getPersonaInfos = function() {
    const channel = window.document.head.querySelector(
      "[property='article:section']"
    );
    const subChannel = window.document.head.querySelector(
      "[itemprop='acquia_lift:content_section']"
    );
    const persona = {
      channel: !!channel && channel.content,
      subChannel: !!subChannel && subChannel.content,
    };

    return !!persona.channel && !!persona.subChannel ? persona : false;
  };

  const getHighestValueByKey = function(key) {
    return Object.keys(personaCollection[key]).reduce(function(a, b) {
      return personaCollection[key][a] > personaCollection[key][b] ? a : b;
    }, 0);
  };

  const getPersona = function() {
    const persona = {};
    channelTypes.forEach(function(type) {
      persona[type] = getHighestValueByKey(type);
    });

    return !!persona && persona;
  };

  const incrementChannel = function(persona, channel) {
    Object.keys(persona).forEach(function(key) {
      if (key === channel) {
        persona[key] += 1;
      }
    });
  };

  const writePersonaCollection = function(persona) {
    channelTypes.forEach(function(type) {
      const channel = persona[type]; // channelName - Beauty as example
      const channelCollection = personaCollection[type]; // channel or subChannel;
      if (!channelCollection.hasOwnProperty(channel))
        channelCollection[channel] = 0;
      incrementChannel(channelCollection, channel);
    });

    window.localStorage.setItem(
      'personaCollection',
      JSON.stringify(personaCollection)
    );
  };

  const getPersonaCollection = function() {
    return JSON.parse(window.localStorage.getItem('personaCollection'));
  };

  const getDefaultCollection = function() {
    const obj = {};
    channelTypes.forEach(function(data) {
      obj[data] = {};
    });
    return obj;
  };

  const getDefaultPersona = function() {
    const obj = {};
    channelTypes.forEach(function(data) {
      obj[data] = '';
    });
    return obj;
  };

  const extendPersona = function(personaInfos) {
    writePersonaCollection(personaInfos);
    window.dataLayer.push({ event: 'executePersona', persona: getPersona() });
  };

  const init = function() {
    const personaInfos = getPersonaInfos();
    personaCollection = getPersonaCollection() || getDefaultCollection();

    if (personaInfos) {
      extendPersona(personaInfos);
    }
  };

  init();
  that.extendPersona = extendPersona;
  that.getPersonaCollection = getPersonaCollection;
  that.getDefaultCollection = getDefaultCollection;
  that.getDefaultPersona = getDefaultPersona;
  that.getPersona = getPersona;
  return that;
})();
