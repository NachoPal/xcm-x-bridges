// export const signAndSendCallback = (eventEval) => 
//   ({ events = [], status }) => {
//     console.log("Petardoooo")
//     if (status.isInBlock) {
//       events.forEach((record: any) => {
//         const { event: { data, method, section, typeDef }} = record

//         let evaluator = new eventEval
//         const { name, lookupName, check } = evaluator
//         console.log("Petardoooo")
//         if (name === `${section.toString()}.${method.toString()}`) {
//           data.forEach((data, index) => {
//             if (lookupName === typeDef[index].lookupName) {
//               console.log(data)
//               process.stdout.write("Holaaaaaaaa")
//               check(data)()
//             }
//           })
//         }
//       });
//       // process.exit(0)
//     }
//   }

export const signAndSendCallback = (eventEval) => 
  ({ events = [], status }) => {
    
    if (status.isInBlock) {
      
      events.forEach((record: any) => {
        const { event: { data, method, section, typeDef }} = record

        let evaluator = new eventEval()
        const { name, lookupName } = evaluator

        if (name === `${section}.${method}`) {
          data.forEach((data, index) => {
            if (lookupName === typeDef[index].lookupName) {
              evaluator.check(data)
            }
          })
        }
      });
      // process.exit(0)
    }
  }