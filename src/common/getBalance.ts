// import getWallet from "./getWallet";

export const getBalance = async (api, wallet) => {
  // let wallet = await getWallet(uri)
  const { data: balance } = await api.query.system.account(wallet.address);

  return balance.free
}