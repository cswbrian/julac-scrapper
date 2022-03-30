import {
  getSearchResultList,
  transformSearchResultListToTable,
  printRow,
} from "./utils.js";

const LIMIT = 100;
const QUERY = `Hong Kong History`
const main = async () => {
  try {
    const data = await getSearchResultList({
      offset: 0,
      limit: LIMIT,
      query: QUERY,
    });
    const {
      info: { total },
    } = transformSearchResultListToTable(data);
    console.log(
      "title#contributor#subject#publisher#creationdate#format#language#lds02"
    );
    // console.log('total', total)
    for (let offset = 0; offset < total; offset += LIMIT) {
      let limit = LIMIT;
      if (offset + LIMIT > total) {
        limit = total - offset;
      }
      // console.log('limit', limit, 'offset', offset)
      const data = await getSearchResultList({
        offset,
        limit,
        query: QUERY,
      });
      const { list } = transformSearchResultListToTable(data);
      list.forEach((item) => printRow(item));
    }
  } catch (e) {
    console.log(e);
  }
};

main();
