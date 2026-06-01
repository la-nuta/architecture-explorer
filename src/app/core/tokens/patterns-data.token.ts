import { InjectionToken } from '@angular/core';
import { ArchitecturePattern } from '../models/architecture-pattern.model';

export const PATTERNS_DATA = new InjectionToken<ArchitecturePattern[]>('PATTERNS_DATA');
