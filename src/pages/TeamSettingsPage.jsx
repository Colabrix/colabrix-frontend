import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Copy, Check, Trash2, Link2 } from 'lucide-react';
import clsx from 'clsx';
import { generateInvite, getOrganizationInvites, revokeInvite } from '../services/apis/invite.js';
import { getOrganizationRoles } from '../services/apis/organization.js';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function TeamSettingsPage() {
  const { orgSlug } = useParams();
  const { organizations } = useAuth();
  const membership = organizations.find((m) => m.organization.slug === orgSlug);
  const organizationId = membership?.organization?.id;

  const [roles, setRoles] = useState([]);
  const [invites, setInvites] = useState([]);
  const [pageError, setPageError] = useState('');
  const [loadingLists, setLoadingLists] = useState(true);

  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [isMultiUse, setIsMultiUse] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!organizationId) return;

    setLoadingLists(true);
    setPageError('');
    Promise.all([getOrganizationRoles(organizationId), getOrganizationInvites(organizationId)])
      .then(([rolesRes, invitesRes]) => {
        setRoles(rolesRes);
        setInvites(invitesRes);
        const memberRole = rolesRes.find((r) => r.name === 'Member') || rolesRes[0];
        if (memberRole) setRoleId(memberRole.id);
      })
      .catch((err) => {
        setPageError(err.message || 'Failed to load team settings.');
      })
      .finally(() => setLoadingLists(false));
  }, [organizationId]);

  const roleNameById = Object.fromEntries(roles.map((r) => [r.id, r.name]));

  async function handleGenerate(e) {
    e.preventDefault();
    if (generating || !roleId) return;

    setGenerating(true);
    setGenerateError('');
    setGeneratedUrl('');
    setCopied(false);
    try {
      const result = await generateInvite(organizationId, {
        roleId,
        isMultiUse,
        expiresInDays: Number(expiresInDays) || 7,
        email: email.trim() || undefined,
      });
      setGeneratedUrl(result.inviteUrl);
      const updated = await getOrganizationInvites(organizationId);
      setInvites(updated);
      setEmail('');
    } catch (err) {
      setGenerateError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy() {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRevoke(inviteId) {
    try {
      await revokeInvite(inviteId);
      setInvites((prev) => prev.filter((i) => i.id !== inviteId));
    } catch (err) {
      setPageError(err.message || 'Failed to revoke invite.');
    }
  }

  return (
    <div className="min-h-full w-full bg-background px-8 py-10">
      <motion.div
        className="mx-auto max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-bold text-primary-gray">Team</h2>
          <p className="mt-1.5 text-sm text-secondary-gray">Invite people to join this workspace</p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-4">
          <ErrorBanner message={pageError} />
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleGenerate}
          className="mb-8 space-y-4 rounded-2xl border border-border-gray bg-white p-6"
        >
          <ErrorBanner message={generateError} />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-gray">
              Email <span className="font-normal text-secondary-gray">(optional)</span>
            </label>
            <input
              type="email"
              placeholder="teammate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border-gray bg-background px-4 py-2.5 text-sm text-primary-gray placeholder:text-secondary-gray/50 focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-primary-gray">Role</label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full rounded-xl border border-border-gray bg-background px-4 py-2.5 text-sm text-primary-gray focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-32">
              <label className="mb-1.5 block text-sm font-medium text-primary-gray">
                Expires (days)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                className="w-full rounded-xl border border-border-gray bg-background px-4 py-2.5 text-sm text-primary-gray focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={isMultiUse}
              onChange={(e) => setIsMultiUse(e.target.checked)}
              className="h-4 w-4 rounded border-border-gray text-primary focus:ring-primary/40"
            />
            <span className="text-[13px] text-secondary-gray">
              Multi-use link (anyone with the link can join, not just one person)
            </span>
          </label>

          <button
            type="submit"
            disabled={generating || !roleId}
            className={clsx(
              'rounded-full px-5 py-2.5 text-sm font-semibold text-white',
              'transition-colors duration-200',
              generating || !roleId
                ? 'cursor-not-allowed bg-primary/40'
                : 'cursor-pointer bg-primary hover:bg-primary/88'
            )}
          >
            {generating ? 'Generating…' : 'Generate invite link'}
          </button>

          {generatedUrl && (
            <div className="flex items-center gap-2 rounded-xl border border-border-gray bg-background px-4 py-2.5">
              <Link2 size={14} className="shrink-0 text-secondary-gray" />
              <span className="flex-1 truncate text-sm text-primary-gray">{generatedUrl}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 cursor-pointer text-secondary-gray transition-colors hover:text-primary-gray"
              >
                {copied ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
              </button>
            </div>
          )}
        </motion.form>

        <motion.div variants={itemVariants}>
          <p className="mb-3 text-sm font-semibold text-primary-gray">Pending invites</p>

          {loadingLists && <p className="text-sm text-secondary-gray">Loading…</p>}

          {!loadingLists && invites.length === 0 && (
            <p className="text-sm text-secondary-gray">No pending invites.</p>
          )}

          <div className="space-y-2">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center gap-4 rounded-xl border border-border-gray bg-white p-4"
              >
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-primary-gray">
                    {invite.email || 'Anyone with the link'}
                  </p>
                  <p className="mt-0.5 text-[13px] text-secondary-gray">
                    {roleNameById[invite.roleId] || 'Member'}
                    {invite.isMultiUse ? ' · Multi-use' : ''} · Expires{' '}
                    {formatDate(invite.expiresAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRevoke(invite.id)}
                  className="shrink-0 cursor-pointer rounded-lg p-2 text-secondary-gray transition-colors hover:bg-red-50 hover:text-red-500"
                  title="Revoke invite"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
