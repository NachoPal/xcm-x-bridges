export const listenToEvent = (api, eventEval, callback = ()=>{}) => {
  api.query.system.events((events) => {
    events.forEach((record) => {
      const { event: { data, method, section, typeDef }} = record

      let evaluator = new eventEval()
      const { name, lookupName } = evaluator
  
      if (name === `${section}.${method}`) {
        data.forEach((data, index) => {
          if (lookupName === typeDef[index].lookupName)
            evaluator.check(data, callback)
        });
      }
    });
  });
}


