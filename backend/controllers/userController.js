const { User, Post } = require('../models/index');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const ROLES = require("../config/roles");

// 创建用户
const createUser = async (req, res) => {
    try {
        const { user_name, password, email, role, status, osu_uid, avatar } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ user_name, password: hashedPassword, email, role, status, osu_uid, avatar });
        res.status(201).json({ message: '用户创建成功' });
    } catch (err) {
        res.status(500).json({ message: '创建用户失败' });
    }
};

// 获取所有用户
const getUsers = async (req, res) => {
    const { page, pageSize, search } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);
    const limit = parseInt(pageSize, 10);
    try {
        const whereCondition = {};
        if (search) {
            whereCondition.user_name = {
                [Op.like]: `%${search}%`
            };
        }
        const { count, rows } = await User.findAndCountAll(
            {
                attributes: { exclude: ['password'] } ,
                where: whereCondition,
                order: [['created_time', 'DESC']],
                offset,
                limit
            }
        );
        const totalPages = Math.ceil(count / limit);
        res.status(200).json({ data: rows, page: parseInt(page, 10), pageSize: limit, totalPages, total: count });
    } catch (err) {
        res.status(500).json({ message: '获取用户列表失败' });
    }
};

// 获取单个用户
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.user_id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: '用户未找到' });
        }
        res.status(200).json({ data: user });
    } catch (err) {
        res.status(500).json({ message: '获取用户失败' });
    }
};

// 更新用户
const updateUser = async (req, res) => {
    const user_id = req.user.user_id;
    const role = req.user.role;
    try {
        const user = await User.findByPk(req.params.user_id);
        if (!user) {
            return res.status(404).json({ message: '用户未找到' });
        }
        const isAdmin = role === ROLES.ADMIN;
        const isOwner = user.user_id === user_id;
        if (isAdmin || isOwner) {
            const { user_name, password, email, role, status, osu_uid, avatar } = req.body;
            if (password){
                const hashedPassword = await bcrypt.hash(password, 10);
                await user.update({ user_name, password: hashedPassword, email, role, status, osu_uid, avatar });
            } else {
                await user.update({ user_name, email, role, status, osu_uid, avatar });
            }
            res.status(200).json({ message: '用户信息更新成功' });
        } else {
            res.status(403).json({ message: '权限不足，无法修改' });
        }
    } catch (err) {
        res.status(500).json({ message: '更新用户信息失败' });
    }
};

// 删除用户
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.user_id);
        if (!user) {
            return res.status(404).json({ message: '用户未找到' });
        }
        await user.destroy();
        res.status(200).json({ message: '用户删除成功' });
    } catch (err) {
        res.status(500).json({ message: '删除用户失败' });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
