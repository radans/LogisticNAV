const fs = require('fs');
const path = require('path');
const Query = require('../../mysql/query');

const saveQuery = new Query(path.join(__dirname, 'sql', 'save.sql'));
const byEmailQuery = new Query(path.join(__dirname, 'sql', 'by_email.sql'));
const saveCollapseQuery = new Query(path.join(__dirname, 'sql', 'save_collapse.sql'));
const saveSettingsQuery = new Query(path.join(__dirname, 'sql', 'save_settings.sql'));
const updatePasswordQuery = new Query(path.join(__dirname, 'sql', 'update_password.sql'));
const allQuery = new Query(path.join(__dirname, 'sql', 'all.sql'));
const allActiveQuery = new Query(path.join(__dirname, 'sql', 'all_active.sql'));
const allWithPlansQuery = new Query(path.join(__dirname, 'sql', 'all_with_plans.sql'));
const emailsQuery = new Query(path.join(__dirname, 'sql', 'emails.sql'));
const planReceiversQuery = new Query(path.join(__dirname, 'sql', 'plan_receivers.sql'));
const byEmailsQuery = new Query(path.join(__dirname, 'sql', 'by_emails.sql'));
const listQuery = new Query(path.join(__dirname, 'sql', 'list.sql'));
const listCountQuery = new Query(path.join(__dirname, 'sql', 'list_count.sql'));
const masterUsersQuery = new Query(path.join(__dirname, 'sql', 'master_users.sql'));
const updateUserAccessQuery = new Query(path.join(__dirname, 'sql', 'update_user_access.sql'));
const topPlanAuthorsQuery = new Query(path.join(__dirname, 'sql', 'top_plan_authors.sql'));

exports.save = async (connection, data) => {
    const results = await saveQuery.run(connection, data);
    return results.insertId;
};

exports.byEmail = async (connection, email) => {
    return byEmailQuery.one(connection, { email });
};

exports.saveCollapse = async (connection, email, collapsed) => {
    return saveCollapseQuery.run(connection, { email, collapsed });
};

exports.saveSettings = async (connection, email, settings) => {
    return saveSettingsQuery.run(connection,
        Object.assign({}, settings, { email }));
};

exports.updatePassword = async (connection, data) => {
    return updatePasswordQuery.run(connection, data);
};

exports.all = async (connection) => {
    return allQuery.run(connection);
};

exports.allActive = async (connection) => {
    return allActiveQuery.run(connection);
};

exports.allWithPlans = async (connection) => {
    return allWithPlansQuery.run(connection);
};

exports.emails = async (connection, userIds) => {
    const rows = await emailsQuery.run(connection, { userIds });
    return rows.map(row => row.email);
};

// Emails of users who want to get plan emails.

exports.planReceivers = async (connection) => {
    return planReceiversQuery.run(connection);
};

exports.byEmails = async (connection, userEmails) => {
    return byEmailsQuery.run(connection, { userEmails });
};

exports.list = async (connection, paginator) => {
    return listQuery.run(connection, paginator.params());
};

exports.listCount = async (connection, paginator) => {
    return listCountQuery.oneField(connection, 'count', paginator.params());
};

exports.masterUsers = async (connection) => {
    const rows = await masterUsersQuery.run(connection);
    return rows.map(row => row.id);
};

exports.updateUserAccess = async (connection, userId, data) => {
    return updateUserAccessQuery.run(connection,
        Object.assign({}, data, { userId }));
};

exports.topPlanAuthors = async (connection) => {
    return topPlanAuthorsQuery.run(connection);
};
