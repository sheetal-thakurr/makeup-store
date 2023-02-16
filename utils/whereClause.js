// base - product.find()
// base - product.find(email : {"sheetal@gmail.com"})

const { json } = require("express");

// bigQuery - //search=Shop&page=2&category=BodyCarerating[gte]=3&price[gte]=999&price[lte]=99&limit=4



class WhereClause {
    constructor(base, bigQuery) {
        this.base = base;
        this.bigQuery = bigQuery
    }

    // search function
    search() {
        let searchWord = this.bigQuery.search ? {
            // name : {searchWord}
            name: {
                $regex: this.bigQuery.search,
                $options: 'i', //'g'
            }
        } : {}

        this.base = this.base.find({ ...searchWord });
        return this;

    }

    // filter

    filter() {
        // copy of bigQuery
        let copyOfBigQuery = { ...this.bigQuery };

        delete copyOfBigQuery["search"];
        delete copyOfBigQuery["page"];
        delete copyOfBigQuery["limit"];

        // convert copyOfBigQuery into String
        let stringOfCopyBQ = JSON.stringify(copyOfBigQuery);

        stringOfCopyBQ.replace(/\b(gte|lte|gt|lt)\b/g, v => `$${v}`);

        // convert stringOfCopyQ into json
        let jsonOfCopyBQ = JSON.parse(stringOfCopyBQ);

        this.base = this.base.find(jsonOfCopyBQ)

        return this;

    }

    // page function
    pager(resultPerPage) {
        let currentPage = 1;

        if (this.bigQuery.page) {
            currentPage = this.bigQuery.page;
        }

        let skipValue = resultPerPage * (currentPage - 1);

        this.base = this.base.limit(resultPerPage).skip(skipValue)

        return this;
    }

}

module.exports = WhereClause;