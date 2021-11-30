import {setupServer} from 'msw/node'
import {rest} from 'msw'
import { brandedGetFoodsResponse, searchResponse } from "./responseFixtures";

function makeServer() {
    const handlers = [
        rest.get(
            'fdc/v1/search',
            async (req, res, ctx) => {
                return res(ctx.json(searchResponse));
            }
        ),
        rest.get(
            'fdc/v1/food/1916888',
            async (req, res, ctx) => {
                return res(ctx.json(brandedGetFoodsResponse));
            }
        )
    ]

    return setupServer(...handlers)
}

export const server = makeServer()
