import * as path from 'path';
import { ToolpadRuntime } from '../../models/ToolpadRuntime';
import { test, expect } from '../../playwright/localTest';

test.use({
  localAppConfig: {
    template: path.resolve(__dirname, './fixture-form'),
    cmd: 'dev',
  },
});

test('submits form data', async ({ page }) => {
  const runtimeModel = new ToolpadRuntime(page);
  await runtimeModel.gotoPage('form');

  const nameInput = page.getByLabel('name');
  await nameInput.clear();
  await nameInput.type('Toolpad');

  const dateInput = page.getByLabel('date', { exact: true });
  await dateInput.focus();
  await dateInput.type('01011990');

  await page.getByLabel('option').click();
  await page.getByRole('option', { name: 'option 2' }).click();

  const testFilePath = path.resolve(__dirname, './test.txt');
  await page.getByLabel('file').setInputFiles(testFilePath);

  await expect(page.getByText('My form data')).toContainText(
    JSON.stringify({
      name: 'Toolpad',
      date: '1990-01-01',
      option: 'option 2',
      file: [
        {
          name: 'test.txt',
          type: 'text/plain',
          size: 6,
          base64: 'data:text/plain;base64,d29ya3MK',
        },
      ],
    }),
  );

  await expect(page.getByRole('button', { name: 'Submitted' })).not.toBeVisible();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('button', { name: 'Submitted' })).toBeVisible();
});

test('resets form data', async ({ page }) => {
  const runtimeModel = new ToolpadRuntime(page);
  await runtimeModel.gotoPage('form');

  const nameInput = page.getByLabel('name');
  await nameInput.clear();
  await nameInput.type('MUI');

  const dateInput = page.getByLabel('date', { exact: true });
  await dateInput.focus();
  await dateInput.type('05051995');

  await page.getByLabel('option').click();
  await page.getByRole('option', { name: 'option 3' }).click();

  const testFilePath = path.resolve(__dirname, './test.txt');
  await page.getByLabel('file').setInputFiles(testFilePath);

  await page.getByRole('button', { name: 'Reset' }).click();

  await expect(page.getByText('My form data')).toContainText(
    JSON.stringify({
      name: 'Default Name',
    }),
  );
});

test('validates form data', async ({ page }) => {
  const runtimeModel = new ToolpadRuntime(page);
  await runtimeModel.gotoPage('form');

  const nameInput = page.getByLabel('name');
  await nameInput.clear();
  await nameInput.type('OK');

  await page.getByLabel('option').click();
  await page.getByRole('option', { name: 'option 1' }).click();

  await page.getByLabel('outside').type('toolong');

  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByText('name must have at least 3 characters.')).toBeVisible();
  await expect(page.getByText('date is required.')).toBeVisible();
  await expect(page.getByText('option is invalid.')).toBeVisible();
  await expect(page.getByText('outside must have no more than 3 characters.')).toBeVisible();
});
