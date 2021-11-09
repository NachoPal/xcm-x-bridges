export const signAndSendCallback = (eventEval) => 
  ({ events = [], status }) => {

    let evaluator = new eventEval()
    const { name, lookupName } = evaluator
    
    if (status.isInBlock) {
      events.forEach((record: any) => {
        const { event: { data, method, section, typeDef }} = record

        if (name === `${section}.${method}`) {
          data.forEach((data, index) => {
            if (lookupName === typeDef[index].lookupName) {
              evaluator.check(data, () => process.exit(0))
            }
          })
        }
      });
    }
  }