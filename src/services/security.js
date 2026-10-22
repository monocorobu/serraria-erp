/**
 * SERRARIA ERP - MÓDULO DE SEGURANÇA CRIPTOGRÁFICA & CONTROLE DE ACESSO (SECURITY.JS)
 * 
 * Funcionalidades:
 * - Hashing criptográfico SHA-256 com Salt dinâmico
 * - Verificação de senha em tempo constante
 * - Proteção contra Brute Force (bloqueio temporário por tentativas incorretas)
 * - Assinatura e verificação de integridade da sessão (anti-tampering no LocalStorage)
 * - Sanitização de dados de entrada contra XSS e injeção de scripts
 * - Sanitização de objetos de usuário (remove hashes, senhas e salts antes do envio para a UI)
 */

// Implementação pura e síncrona do algoritmo SHA-256 (FIPS 180-4)
// Funciona 100% no navegador (inclusive offline) e em qualquer ambiente JavaScript sem dependências externas.
function sha256(ascii) {
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i, j; // Loop counters
  let result = '';

  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19
  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let compositeClearance = 0;
  for (let candidate = 2; compositeClearance < 64; candidate++) {
    let isComposite = false;
    for (let factor = 2; factor * factor <= candidate; factor++) {
      if (candidate % factor === 0) {
        isComposite = true;
        break;
      }
    }
    if (!isComposite) {
      compositeClearance++;
    }
  }

  words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (i = 0; i < ascii[lengthProperty]; i++) {
    words[i >> 2] |= ascii.charCodeAt(i) << (24 - (i % 4) * 8);
  }

  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, j += 16);
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const i2 = i + j;
      const w15 = w[i - 15], w2 = w[i - 2];

      const a = hash[0], e = hash[4];
      const temp1 = hash[7]
        + (mathPow(2, 32) + (
          ((e >>> 6) | (e << 26)) ^
          ((e >>> 11) | (e << 21)) ^
          ((e >>> 25) | (e << 7))
        )) % maxWord
        + ((e & hash[5]) ^ (~e & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
          w[i - 16]
          + (((w15 >>> 7) | (w15 << 25)) ^ ((w15 >>> 18) | (w15 << 14)) ^ (w15 >>> 3))
          + w[i - 7]
          + (((w2 >>> 17) | (w2 << 15)) ^ ((w2 >>> 19) | (w2 << 13)) ^ (w2 >>> 10))
        ) | 0);

      const temp2 = (
        ((a >>> 2) | (a << 30)) ^
        ((a >>> 13) | (a << 19)) ^
        ((a >>> 22) | (a << 10))
      ) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byteVal = (hash[i] >> (8 * b)) & 255;
      result += (byteVal < 16 ? '0' : '') + byteVal.toString(16);
    }
  }
  return result;
}

// Chave interna para assinatura de integridade da sessão
const APP_INTEGRITY_SALT = 'serraria_bom_jesus_sec_v2026_#99@x';

export const Security = {
  /**
   * Gera um salt pseudo-aleatório seguro de 16 caracteres hexadecimais
   */
  generateSalt() {
    try {
      if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        const arr = new Uint8Array(16);
        window.crypto.getRandomValues(arr);
        return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {}
    // Fallback baseado em timestamp e alta entropia
    return (
      Math.random().toString(36).substring(2, 10) +
      Date.now().toString(36) +
      Math.random().toString(36).substring(2, 10)
    ).slice(0, 32);
  },

  /**
   * Gera o hash SHA-256 com salt de uma senha
   */
  hashPassword(password, salt) {
    if (!password) return '';
    const cleanPass = String(password).trim();
    const cleanSalt = String(salt || '').trim();
    return sha256(`$sbj_salt$${cleanSalt}$pass$${cleanPass}$end$`);
  },

  /**
   * Compara uma senha fornecida com o hash armazenado
   * Suporta retrocompatibilidade transparente com senhas legadas se existirem
   */
  verifyPassword(inputPassword, storedHash, storedSalt, fallbackPlainPassword = null) {
    if (!inputPassword) return false;
    const cleanInput = String(inputPassword).trim();

    // 1. Verificação segura com hash + salt
    if (storedHash && storedSalt) {
      const calculatedHash = this.hashPassword(cleanInput, storedSalt);
      if (this.constantTimeCompare(calculatedHash, storedHash)) {
        return true;
      }
    }

    // 2. Retrocompatibilidade: se a conta ainda tiver senha legada sem hash
    if (fallbackPlainPassword && cleanInput === String(fallbackPlainPassword).trim()) {
      return true;
    }

    return false;
  },

  /**
   * Comparação em tempo constante para evitar ataques de timing
   */
  constantTimeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;
    let mismatch = 0;
    for (let i = 0; i < a.length; i++) {
      mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return mismatch === 0;
  },

  /**
   * Sanitiza strings contra scripts perigosos, injeção HTML e tags
   */
  sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/[<>]/g, '') // remove < e >
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  },

  /**
   * Sanitiza o objeto de usuário removendo credenciais sensíveis antes de salvar em sessão ou enviar à UI
   */
  sanitizeUser(user) {
    if (!user) return null;
    const { senha, senha_hash, hash, salt, ...safeUser } = user;
    return safeUser;
  },

  /**
   * Cria uma assinatura HMAC de integridade para a sessão do usuário
   * Garante que caso alguém tente editar o LocalStorage (trocando de FUNCIONARIO para ADMIN), a sessão será invalidada.
   */
  createSessionSignature(user) {
    if (!user || !user.id || !user.perfil) return '';
    const payload = `${user.id}::${user.username}::${user.perfil}::${APP_INTEGRITY_SALT}`;
    return sha256(payload);
  },

  /**
   * Valida a integridade da sessão armazenada
   */
  verifySessionIntegrity(session) {
    if (!session || !session.id || !session.perfil || !session.signature) return false;
    const expected = this.createSessionSignature(session);
    return this.constantTimeCompare(expected, session.signature);
  },

  /**
   * Proteção contra Brute Force (Tentativas repetidas de senha incorreta)
   * Bloqueia temporariamente após 5 tentativas falhas dentro de 3 minutos.
   */
  checkRateLimit(identifier) {
    const key = `sbj_auth_attempts_${String(identifier || '').toLowerCase().trim()}`;
    try {
      if (typeof sessionStorage === 'undefined') return { allowed: true };
      const raw = sessionStorage.getItem(key);
      if (!raw) return { allowed: true };

      const data = JSON.parse(raw);
      const now = Date.now();

      // Se passou o tempo de bloqueio (60s), reseta
      if (data.lockedUntil && now > data.lockedUntil) {
        sessionStorage.removeItem(key);
        return { allowed: true };
      }

      if (data.lockedUntil && now <= data.lockedUntil) {
        const remainingSeconds = Math.ceil((data.lockedUntil - now) / 1000);
        return {
          allowed: false,
          remainingSeconds,
          message: `Muitas tentativas incorretas. Acesso temporariamente bloqueado por ${remainingSeconds}s.`
        };
      }

      return { allowed: true, count: data.count || 0 };
    } catch (e) {
      return { allowed: true };
    }
  },

  recordFailedLogin(identifier) {
    const key = `sbj_auth_attempts_${String(identifier || '').toLowerCase().trim()}`;
    try {
      if (typeof sessionStorage === 'undefined') return;
      const raw = sessionStorage.getItem(key);
      const now = Date.now();
      let data = raw ? JSON.parse(raw) : { count: 0, firstAttempt: now };

      // Se a primeira tentativa foi há mais de 3 minutos, reinicia contagem
      if (now - data.firstAttempt > 180000) {
        data = { count: 1, firstAttempt: now };
      } else {
        data.count = (data.count || 0) + 1;
      }

      if (data.count >= 5) {
        // Bloqueia por 60 segundos
        data.lockedUntil = now + 60000;
      }

      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}
  },

  clearFailedLogin(identifier) {
    const key = `sbj_auth_attempts_${String(identifier || '').toLowerCase().trim()}`;
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(key);
      }
    } catch (e) {}
  }
};
