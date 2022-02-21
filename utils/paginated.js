async function* paginated(perform, limit = Infinity) {
  let nextPage = undefined;
  for (let i = 0; nextPage != null, i < limit; i++) {
    const result = await perform(nextPage);
    if (result.isErr()) {
      throw result.error;
    } else {
      nextPage = result.value.nextPage;
      yield result.value;
    }
  }
}

module.exports = { paginated };
