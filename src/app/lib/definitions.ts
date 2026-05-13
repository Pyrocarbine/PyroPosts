import { z } from 'zod'

export const SignupFormSchema = z.object({
    name: z.string()
        .min(2, { message: "Name should be at least 2 characters long" })
        .trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z.string()
        .min(6, { message: 'Password should be at least 6 characters long.' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
        })
        .trim(),
})

export type FormState = 
| {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
    }
    message?: string;
    }
| undefined;

export const options = [
  { value: 'reading', label: 'Reading' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'coding', label: 'Coding' },
  { value: 'photography', label: 'Photography' },
  { value: 'drawing', label: 'Drawing' },
  { value: 'painting', label: 'Painting' },
  { value: 'writing', label: 'Writing' },
  { value: 'music', label: 'Music' },
  { value: 'singing', label: 'Singing' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'baking', label: 'Baking' },
  { value: 'hiking', label: 'Hiking' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'running', label: 'Running' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'traveling', label: 'Traveling' },
  { value: 'gardening', label: 'Gardening' },
  { value: 'fishing', label: 'Fishing' },
  { value: 'movies', label: 'Movies' },
  { value: 'sports', label: 'Sports' },
];
