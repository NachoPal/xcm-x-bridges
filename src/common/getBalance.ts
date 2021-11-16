// import getWallet from "./getWallet";

export const getBalance = async (api, address) => {
  // let wallet = await getWallet(uri)
  const { data: balance } = await api.query.system.account(address);

  return balance.free
}