export interface Sampler {
  id: string;
  name: string;
  description: string;
}

export const samplers: Sampler[] = [
  { id: 'euler', name: 'Euler', description: 'Fast, good quality' },
  { id: 'euler_a', name: 'Euler Ancestral', description: 'More creative, varied results' },
  { id: 'dpm++_2m', name: 'DPM++ 2M', description: 'High quality, balanced' },
  { id: 'dpm++_2m_karras', name: 'DPM++ 2M Karras', description: 'Enhanced quality with Karras noise' },
  { id: 'dpm++_sde', name: 'DPM++ SDE', description: 'Stochastic, more detail' },
  { id: 'dpm++_sde_karras', name: 'DPM++ SDE Karras', description: 'Best quality, slower' },
  { id: 'ddim', name: 'DDIM', description: 'Deterministic, consistent results' },
  { id: 'lms', name: 'LMS', description: 'Linear multi-step, smooth results' },
  { id: 'heun', name: 'Heun', description: 'Higher order, better accuracy' },
];
