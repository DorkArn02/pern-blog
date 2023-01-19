import { DataTypes } from "sequelize"
import { sequelize } from "../db/database.js"
import Comment from "./Comment.js"


const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
},)

Post.hasMany(Comment, {
    foreignKey: {
        allowNull: false,
        name: "post_id"
    }
})
export default Post