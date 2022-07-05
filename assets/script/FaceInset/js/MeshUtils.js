const Amaz = effect.Amaz;

// GridVertex
// Vertex helper class for grid generation
class GridVertex {

    // constructor
    // Takes in grid position, index, width, and height of a vertex. Calculates the UV
    // and other properties, then returns the GridVertex object
    constructor(i, j, index, width, height) {
        this._x = 2 * i / width - 1;
        this._y = 2 * j / height - 1;
        this._z = 0;
        this._uv0 = {u: i / width, v: j / height}; 
        this._uv1 = {u: 0, v: 0};
        this._color = new Amaz.Vector4f(0, 0, 0, 1);
        this.index = index;
    }

    // setExtraAttributes
    // Sets extra attributes in the vertex
    setExtraAttributes(color, u1, v1) {
        this._color = color;
        this._uv1.u = u1;
        this._uv1.v = v1;
    }

    // getVertexData
    // Gets vertex attribute data in the correct order
    getVertexData() {
        return [
            this._x, 
            this._y, 
            this._z, 
            this._uv0.u, 
            this._uv0.v, 
            this._uv1.u, 
            this._uv1.v, 
            this._color.x, 
            this._color.y, 
            this._color.z, 
            this._color.w
        ];
    }
}

// GridQuad
// Helper class for generating quads for a grid mesh using GridVertices
class GridQuad {

    // constructor
    // Saves width and height, sets default indices to 0
    constructor(width, height) {
        this._width = width;
        this._height = height;
        this._index0 = 0;
        this._index1 = 0;
        this._index2 = 0;
        this._index3 = 0;
    }

    // setIndicesFromVertices
    // Save the indices from the vertices that should be within the quad
    setIndicesFromVertices(vertex0, vertex1, vertex2, vertex3) {
        this._index0 = vertex0.index;
        this._index1 = vertex1.index;
        this._index2 = vertex2.index;
        this._index3 = vertex3.index;
    }

    // getIndexData
    // Returns quad vertex indices in the correct winding order
    getIndexData() {
        const indexData = [
            this._index0,
            this._index1,
            this._index2,
            this._index2,
            this._index1,
            this._index3,
        ];
        return indexData;
    }
}

// GridMeshHelper
// A helper class for creating grid meshes.
// A grid is a NxM sheet of quads that are optionally sharing vertices
class GridMeshHelper {

    // constructor
    // Takes in width, height, and isConected flag, and generates the respective vertices and quads vectors for putting
    // into the Amaz.Mesh
    constructor(width, height, isConnected) {
        this._width = width;
        this._height = height;
        this._isConnected = isConnected;
        this._vertices = [];
        this._availableVertices = {};
        this._quads = [];
        this._createVertices();
        this._createQuads();
    }

    // _createVertex
    // Create and push grid vertex onto vertex list, and if the mesh
    // is not connected, the availableVertices map as well
    _createVertex(i, j) {
        const vertex = new GridVertex(
            i, 
            j, 
            this._vertices.length, 
            this._width, 
            this._height
        );
        this._vertices.push(vertex);
        const key = GridMeshHelper._createVertexKey(i, j);
        if (this._availableVertices[key] == null) {
            this._availableVertices[key] = [];
        }
        this._availableVertices[key].push(vertex);
    }

    // _popAvailableVertex
    // Get an available vertex at spot (i, j); there will be several vertices at this spot if 
    // the quads are disconnected and not sharing vertices
    _popAvailableVertex(i, j) {
        const key = GridMeshHelper._createVertexKey(i, j);
        return this._availableVertices[key].pop();
    }

    // _peekAvailableVertex
    // Get an available vertex at spot (i, j); there will be several vertices at this spot if 
    // the quads are disconnected and not sharing vertices
    _peekAvailableVertex(i, j) {
        const key = GridMeshHelper._createVertexKey(i, j);
        return this._availableVertices[key][0];
    }

    // _createVertexKey
    // Makes a simple string key using indices
    static _createVertexKey(i, j) {
        return i + ", " + j;
    }

    // _createRandomColorVector
    // Returns random color as Vector4f type
    static _createRandomColorVector() {
        return new Amaz.Vector4f(
            Math.random(), 
            Math.random(), 
            Math.random(), 
            Math.random()
        );
    }

    // _createVertices
    // Generates vertices for the grid. Generates extra vertices if needed, if the quads are
    // disconnected
    _createVertices() {
        this._vertices = [];
        this._availableVertices = {};
        for (let i = 0; i <= this._width; i++) {
            for (let j = 0; j <= this._height; j++) {
                this._createVertex(i, j);
                if (!this.isConnected) {
                    if (i !== 0 && i !== this._width) {
                        this._createVertex(i, j);
                    }
                    if (j !== 0 && j !== this._height) {
                        this._createVertex(i, j);
                    }
                    if (i !== 0 && i !== this._width && j !== 0 && j !== this._height) {
                        this._createVertex(i, j);
                    }
                }
            }
        }
    }

    // _createQuads
    // Generates quads using the GridQuad helper class with the quad's position in the grid
    // and taking into account the grid's connectedness
    _createQuads() {
        if (this._vertices == null || this._vertices.length === 0) {
            Amaz.LOGE("GridMesh", "Cannot create quads without vertices!");
            return null;
        }
        this._quads = [];
        // One indexed because this is a direct translation from Lua 
        for (let i = 1; i <= this._width; i++) {
            for (let j = 1; j <= this._height; j++) {
                const quad = new GridQuad(this._width, this._height);
                let vertex0 = null;
                let vertex1 = null;
                let vertex2 = null;
                let vertex3 = null;
                if (this._isConnected) {
                    vertex0 = this._peekAvailableVertex(i - 1, j - 1);
                    vertex1 = this._peekAvailableVertex(i, j - 1);
                    vertex2 = this._peekAvailableVertex(i - 1, j);
                    vertex3 = this._peekAvailableVertex(i, j);
                } else {
                    vertex0 = this._popAvailableVertex(i - 1, j - 1);
                    vertex1 = this._popAvailableVertex(i, j - 1);
                    vertex2 = this._popAvailableVertex(i - 1, j);
                    vertex3 = this._popAvailableVertex(i, j);
                }
                const color = GridMeshHelper._createRandomColorVector();
                vertex0.setExtraAttributes(color, 0, 1);
                vertex1.setExtraAttributes(color, 1, 1);
                vertex2.setExtraAttributes(color, 0, 0);
                vertex3.setExtraAttributes(color, 1, 0);
                quad.setIndicesFromVertices(vertex0, vertex1, vertex2, vertex3);

                this._quads.push(quad);
            }
        }
    }

    // getVertexData
    // Gets vertex data from all vertices in the grid and pushes them into a vector for the Amaz.Mesh
    getVertexData() {
        let vertexDataVec = new Amaz.FloatVector();
        for (const vertex of this._vertices) {
            const vertexData = vertex.getVertexData();
            for (let i = 0; i < vertexData.length; i++) {
                vertexDataVec.pushBack(vertexData[i]);
            }
        }
        return vertexDataVec;
    }

    // getIndexData
    // Gets index data from all quads in the grid and pushes them into a vector for the Amaz.Mesh
    getIndexData() {
        let indexDataVec = new Amaz.UInt16Vector();
        for (const quad of this._quads) {
            const indexData = quad.getIndexData();
            for (let i = 0; i < indexData.length; i++) {
                indexDataVec.pushBack(indexData[i]);
            }
        }
        return indexDataVec;
    }
}

class MeshUtils {

    // createQuadMesh
    // Creates a unit quad mesh from RTTI calls
    static createQuadMesh() {
        const minX = -1;
        const minY = -1;
        const maxX = 1;
        const maxY = 1;
        let mesh = new Amaz.Mesh();
        let pos = new Amaz.VertexAttribDesc();
        pos.semantic = Amaz.VertexAttribType.POSITION;
        let uv = new Amaz.VertexAttribDesc();
        let vads = new Amaz.Vector();
        const vertexData = [
            maxX, maxY, 0.0, 1.0, 1.0,
            maxX, minY, 0.0, 1.0, 0.0,
            minX, minY, 0.0, 0.0, 0.0,
            minX, maxY, 0.0, 0.0, 1.0
        ];
        let fv = new Amaz.FloatVector();
        for (let i = 0; i < vertexData.length; i++) {
            fv.pushBack(vertexData[i]);
        }
        mesh.vertices = fv;
        let subMesh = new Amaz.SubMesh();
        subMesh.primitive = Amaz.Primitive.TRIANGLES;
        const indexData = [
            0, 1, 2, 2, 3, 0
        ];
        let indices = new Amaz.UInt16Vector();
        for (let i = 0; i < indexData.length; i++) {
            indices.pushBack(indexData[i]);
        }
        subMesh.indices16 = indices;
        subMesh.mesh = mesh;
        mesh.addSubMesh(subMesh);
        return mesh;
    }

    // createGridMesh
    // Using GridhMeshHelper class, generate the vertices and indices
    // for an N x M grid mesh. isConnected specifies if the vertices
    // are connected, and therefore interpolated between (flat vs smooth)
    static createGridMesh(width, height, isConnected = true) {
        const w = Math.floor(width);
        const h = Math.floor(height);
        const gridMeshHelper = new GridMeshHelper(w, h, isConnected);
        let mesh = new Amaz.Mesh();
        let pos = new Amaz.VertexAttribDesc();
        pos.semantic = Amaz.VertexAttribType.POSITION;
        let uv0 = new Amaz.VertexAttribDesc();
        uv0.semantic = Amaz.VertexAttribType.TEXCOORD0;
        let uv1 = new Amaz.VertexAttribDesc();
        uv1.semantic = Amaz.VertexAttribType.TEXCOORD1;
        let color = new Amaz.VertexAttribDesc();
        color.semantic = Amaz.VertexAttribType.COLOR;
        let vads = new Amaz.Vector();
        vads.pushBack(pos);
        vads.pushBack(uv0);
        vads.pushBack(uv1);
        vads.pushBack(color);
        mesh.vertexAttribs = vads;
        mesh.vertices = gridMeshHelper.getVertexData();
        let subMesh = new Amaz.SubMesh();
        subMesh.primitive = Amaz.Primitive.TRIANGLES;
        subMesh.indices16 = gridMeshHelper.getIndexData();
        subMesh.mesh = mesh;
        mesh.addSubMesh(subMesh);
        return mesh;
    }
}

exports.MeshUtils = MeshUtils;