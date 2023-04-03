// import { select } from 'd3-selection';
// import { line } from 'd3-shape';
//
// export function link(node: HTMLElement, links: {source: number, target: number}[], nodes: {id: number, x: number, y: number}[]) {
//     const svg = select(node);
//
//     const linkPath = line()
//         .x(d => getNodeById(d.source).x)
//         .y(d => getNodeById(d.source).y);
//
//     function getNodeById(id: number) {
//         return nodes.find(node => node.id === id);
//     }
//
//     function ticked() {
//         svg.selectAll('.link')
//             .attr('x1', d => getNodeById(d.source).x)
//             .attr('y1', d => getNodeById(d.source).y)
//             .attr('x2', d => getNodeById(d.target).x)
//             .attr('y2', d => getNodeById(d.target).y)
//             .attr('d', d => linkPath([getNodeById(d.source), getNodeById(d.target)]));
//     }
//
//     return {
//         update(newLinks: { source: number; target: number; }[], newNodes: { id: number; x: number; y: number; }[]) {
//             links = newLinks;
//             nodes = newNodes;
//             ticked();
//         }
//     };
// }

import { select } from 'd3-selection';
import { line } from 'd3-shape';

export function link(node: HTMLElement, links: {source: number, target: number}[], nodes: {id: number, x: number, y: number}[]) {
    const svg = select(node);

    const linkPath = line()
        .x(d => d[0])
        .y(d => d[1]);

    function getNodeById(id: number) {
        return nodes.find(node => node.id === id);
    }

    function ticked() {
        svg.selectAll('.link')
            .attr('x1', d => getNodeById(d.source).x)
            .attr('y1', d => getNodeById(d.source).y)
            .attr('x2', d => getNodeById(d.target).x)
            .attr('y2', d => getNodeById(d.target).y)
            .attr('d', d => linkPath([[getNodeById(d.source).x, getNodeById(d.source).y], [getNodeById(d.target).x, getNodeById(d.target).y]]));
    }

    return {
        update(newLinks: { source: number; target: number; }[], newNodes: { id: number; x: number; y: number; }[]) {
            links = newLinks;
            nodes = newNodes;
            ticked();
        }
    };
}