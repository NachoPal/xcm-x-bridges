
export const signAndSendCallback = () => 
  ({ events = [], status }) => {
    if (status.isInBlock) {
      events.forEach((result: any) => {
        const { event: { data, method, section }, phase } = result
        
        if (`${section.toString()}.${method.toString()}` === 'xcmPallet.Attempted') {
          // console.log('\t', phase.toString(), `: ${section.toString()}.${method.toString()}\n`, data.toHuman());
          let reason = data.toString();

          if (data[0].isComplete) {
            process.stdout.write(`xcmPallet.Attempted - OK - ${reason}\n`, () => process.exit(0))
            process.exit(0)
          } else {    
            process.stderr.write(`xcmPallet.Attempted - FAILED - ${reason}\n`, () => process.exit(1))
          }
        }
      });
      process.exit(0)
    }
  }

