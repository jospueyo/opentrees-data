#!/usr/bin/env node
require('make-dir').sync('mbtiles');
const tippecanoe = require('tippecanoe');
const fs = require('fs');
const child_process = require('child_process');
const fields = {
    captured: 15,
    class: 15,
    common: 10,
    crown: 13,
    dbh: 13,
    description: 13,
    family: 10,
    genus: 1,
    health: 10,
    height: 13,
    id: 13,
    location: 15,
    maturity: 12,
    planted: 15,
    ref: 13,
    scientific: 10,
    source: 8,
    species: 1,
    species_count: 10,
    structure: 15,
    subclass: 15,
    tree_type: 15,
    ule: 15,
    ule_max: 15,
    ule_min: 15,
    updated: 15,
    variety: 13
}


const files = fs.readdirSync('out').filter(f => f.match(/\.geojson$/)).map(f => `out/${f}`);

//
// tippecanoe(files, {
tippecanoe(['tmp/allout.json'], {
    layer:'trees',
    force:true, 
    output:'mbtiles/trees-wip.mbtiles',
    minimumZoom: 1,
    maximumZoom: 15,
    baseZoom: 10,
    minimumDetail:7,
    forceFeatureLimit: true,
    rf: 200000 ,
    readParallel: true,
    featureFilter: { 'trees': ['all', 
        ...Object.keys(fields).map(f => [
            'attribute-filter', 
            f, 
            ['>=', '$zoom', fields[f]]
        ])]
    }
}, { echo: true });

child_process.execSync('mv mbtiles/trees.mbtiles mbtiles/trees-old.mbtiles');
child_process.execSync('mv mbtiles/trees-wip.mbtiles mbtiles/trees.mbtiles');
console.log('Tiles now in mbtiles/trees.mbtiles');