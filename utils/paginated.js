async function* paginated(perform, limit = Infinity) {
  let nextPage = undefined;
  let i = 0;
  do {
    const result = await perform(nextPage);
    if (result.isErr()) {
      throw result.error;
    } else {
      nextPage = result.value.nextPage;
      yield result.value;
    }
    i++;
  } while (nextPage != null && i < limit);
}

module.exports = { paginated };
