window.Persona = (function Persona() {
  const that = {};
  const channelTypes = ['channel', 'subChannel'];
  let personaCollection;

  const getPersonaInfos = () => {
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

  const getHighestValueByKey = key =>
    Object.keys(personaCollection[key]).reduce(
      (a, b) => (personaCollection[key][a] > personaCollection[key][b] ? a : b),
      0
    );

  const getPersona = () => {
    const persona = {};
    channelTypes.forEach(type => {
      persona[type] = getHighestValueByKey(type);
    });

    return !!persona && persona;
  };

  const incrementChannel = (persona, channel) => {
    Object.keys(persona).forEach(key => {
      if (key === channel) {
        persona[key] += 1;
      }
    });
  };

  const writePersonaCollection = persona => {
    channelTypes.forEach(type => {
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

  const getPersonaCollection = () =>
    JSON.parse(window.localStorage.getItem('personaCollection'));

  const getDefaultCollection = () => {
    const obj = {};
    channelTypes.forEach(data => {
      obj[data] = {};
    });
    return obj;
  };

  const getDefaultPersona = () => {
    const obj = {};
    channelTypes.forEach(data => {
      obj[data] = '';
    });
    return obj;
  };

  const extendPersona = personaInfos => {
    writePersonaCollection(personaInfos);
    window.dataLayer.push({ event: 'executePersona', persona: getPersona() });
  };

  const init = () => {
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
