import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import FacultyManagementLayout from '@/pages/Faculty/management/index';
import { proposal_review } from '@/routes/faculty/management/committee';
import { type BreadcrumbItem } from '@/types';

type Proposal = {
  proposal_id: number;
  proposal_title: string;
  proposal_filepath: string;
  submitted_date: string;
  advisor_name: string;
  block: string;
  my_status: boolean | null;
  my_comment: string | null;
  proponents: string;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Proposal Review', href: proposal_review().url },
];

export default function ProposalReview({
  proposals,
}: {
  proposals: { pending: Proposal[]; evaluated: Proposal[]; under_review: Proposal[] };
}) {
  const renderProposalRow = (proposal: Proposal) => {
    // Each row has its own useForm for independent state
    const { data, setData, post, processing } = useForm({
      proposal_id: proposal.proposal_id,
      is_approved: proposal.my_status ?? false, // prefill if already evaluated
      comment: proposal.my_comment ?? '',
    });

    return (
      <tr key={proposal.proposal_id} className={proposal.my_status !== null ? 'bg-gray-50' : ''}>
        <td className="border p-2">{proposal.proposal_title}</td>
        <td className="border p-2">{proposal.proponents}</td>
        <td className="border p-2">{proposal.advisor_name}</td>
        <td className="border p-2">{proposal.block}</td>
        <td className="border p-2">{proposal.submitted_date}</td>
        <td className="border p-2">
          {proposal.my_status === null
            ? 'Pending'
            : data.is_approved
            ? 'Approved'
            : 'Rejected'}
        </td>
        <td className="border p-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              post(proposal_review().url, {
                onSuccess: () => alert('Evaluation submitted/updated!'),
              });
            }}
          >
            <select
              value={data.is_approved ? '1' : '0'}
              onChange={(e) => setData('is_approved', e.target.value === '1')}
              className="border p-1 mr-2"
            >
              <option value="1">Approve</option>
              <option value="0">Reject</option>
            </select>
            <input
              type="text"
              placeholder="Comment"
              value={data.comment}
              onChange={(e) => setData('comment', e.target.value)}
              className="border p-1 mr-2"
            />
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-500 text-white px-2 py-1 rounded disabled:opacity-50"
            >
              Submit
            </button>
          </form>
        </td>
      </tr>
    );
  };

  return (
    <FacultyManagementLayout
      breadcrumbs={breadcrumbs}
      title="Proposal Review"
      description="Review and evaluate thesis proposals submitted for committee approval"
    >
      <Head title="Proposal Review" />

      <div className="overflow-x-auto mt-4">
        <h2 className="text-lg font-semibold mb-2">Proposals</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Title</th>
              <th className="border p-2">Proponents</th>
              <th className="border p-2">Advisor</th>
              <th className="border p-2">Block</th>
              <th className="border p-2">Submitted Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Render all pending and evaluated proposals */}
            {proposals.pending.map(renderProposalRow)}
            {proposals.evaluated.map(renderProposalRow)}
          </tbody>
        </table>
      </div>
    </FacultyManagementLayout>
  );
}
