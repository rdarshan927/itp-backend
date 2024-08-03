const rolesModel = require('../models/EmployeeRolesModel')

const createRole = async (req, res) => {
    try {
        const { roleID, roleName, basicSalary } = req.body;
        const alreadyExist = await rolesModel.findOne({ $or: [{ roleID }, { roleName }] });

        if(alreadyExist) {
            return res.status(400).json({ message: 'Role ID or Role Name already exists!' });
        }

        const newRole = new rolesModel({
            roleID, roleName, basicSalary
        });

        await newRole.save();
        res.status(201).json({ message: 'Role has been Successfully created!' });

    } catch(error) {
        res.status(500).json({ message: 'Failed to create the Role!'});
        console.log(error)
    }
}

module.exports = {
    createRole,
}