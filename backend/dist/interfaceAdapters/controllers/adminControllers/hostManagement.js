"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unblockHost = exports.blockHost = exports.getAllHosts = void 0;
const Host_1 = __importDefault(require("../../../entities/Host"));
//Fetch All Hosts
const getAllHosts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5; // Default to 5 hosts per page
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const hosts = await Host_1.default.find().skip(skip).limit(limit); // Fetch hosts with pagination
        const totalHosts = await Host_1.default.countDocuments(); // Total number of hosts
        res.status(200).json({
            message: 'Successfully fetched users',
            hosts,
            totalPages: Math.ceil(totalHosts / limit),
            currentPage: page,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch hosts' });
    }
};
exports.getAllHosts = getAllHosts;
//Block Hosts
const blockHost = async (req, res) => {
    try {
        const hostId = req.params.id;
        console.log("Host id:", hostId);
        const host = await Host_1.default.findById(hostId);
        if (!host) {
            return res.status(404).json({ message: 'Host not found.' });
        }
        host.isBlocked = true;
        await host.save();
        console.log("Host blocked SUccessfully");
        console.log("Blocked Host:", host);
        return res.status(200).json({ message: "Host blocked Successfully", host });
    }
    catch (error) {
        return res.status(500).json({ message: "Error blocking host." });
    }
};
exports.blockHost = blockHost;
const unblockHost = async (req, res) => {
    try {
        const hostId = req.params.id;
        const host = await Host_1.default.findById(hostId);
        if (!host) {
            return res.status(404).json({ message: "Host not found" });
        }
        host.isBlocked = false;
        host.save();
        console.log("Host unblocked succesfully");
        return res.status(200).json({ message: 'Host unblocked Successfully', host });
    }
    catch (error) {
        return res.status(500).json({ message: "Error to unblock host, Internal server error" });
    }
};
exports.unblockHost = unblockHost;
//APPROVE OR REJECT HOST
// Fetch pending hosts
// export const getPendingHosts = async (req: Request, res: Response) => {
//   try {
//     const pendingHosts = await Host.find({ status: 'pending' }); // Assuming 'pending' status
//     res.status(200).json({ hosts: pendingHosts });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch pending hosts' });
//   }
// };
// // Approve host
// let pendingHosts: any[] = []; // In-memory store for simplicity
// export const approveHost = async (req: Request, res: Response) => {
//   const { email } = req.body; // Assume admin sends email of the host to approve
//   // Find the host data in the in-memory store
//   const hostData = pendingHosts.find((host) => host.email === email);
//   if (!hostData) {
//       return res.status(404).json({ message: 'Host not found in pending list.' });
//   }
//   try {
//       const hashedPassword = await bcrypt.hash(hostData.password, 10);
//       const newHost = new Host({
//           name: hostData.name,
//           email: hostData.email,
//           password: hashedPassword,
//           verified: true, // Mark as verified
//       });
//       await newHost.save();
//       // Remove from pending list after approval
//       pendingHosts = pendingHosts.filter((host) => host.email !== email);
//       res.status(201).json({ message: 'Host approved successfully.' });
//   } catch (error) {
//       res.status(500).json({ message: 'Server error', error });
//   }
// };
// // Reject host
// export const rejectHost = async (req: Request, res: Response) => {
//   try {
//     const { hostId } = req.params;
//     const host = await Host.findByIdAndUpdate(
//       hostId,
//       { status: 'rejected' }, // Updating the host status to rejected
//       { new: true }
//     );
//     if (!host) {
//       return res.status(404).json({ message: 'Host not found' });
//     }
//     res.status(200).json({ host });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to reject host' });
//   }
// };
