import mongoose from 'mongoose';

interface IPet {
	ownerId: string;
	name?: string;
	happiness?: number;
	fullness?: number;
	hygiene?: number;
	love?: number;
	energy?: number;
	experience?: number;
	level?: number;
}

const petSchema = new mongoose.Schema<IPet>({
	ownerId: { type: String, required: true, unique: true },
	name: { type: String, default: 'Doge <:doge:988485797667819520>' },
	happiness: { type: Number, default: 100 },
	fullness: { type: Number, default: 100 },
	hygiene: { type: Number, default: 100 },
	love: { type: Number, default: 10 },
	energy: { type: Number, default: 100 },
	experience: { type: Number, default: 0 },
	level: { type: Number, default: 0 }
});

export default mongoose.model<IPet>('Pet', petSchema);
