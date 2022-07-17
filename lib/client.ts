export const ClientQuery = (hookName: string) => () => {
  const blaBla = "some client side hook execution";
  console.log(blaBla);

  return {
    loading: false,
    params: {},
    data: {}
  }
}